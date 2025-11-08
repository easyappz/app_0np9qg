from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from django.db.models import Q
from rest_framework import status, generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.generics import RetrieveUpdateAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Listing, Category
from .serializers import (
    MessageSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserUpdateSerializer,
    PublicUserSerializer,
    TokenSerializer,
    CategorySerializer,
    ListingListSerializer,
    ListingDetailSerializer,
    ListingCreateSerializer,
    ListingUpdateSerializer,
)
from .filters import ListingFilter
from .permissions import IsAuthorOrReadOnly

User = get_user_model()


class HelloView(APIView):
    """
    A simple API endpoint that returns a greeting message.
    """

    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    """
    API endpoint for user registration
    """
    permission_classes = [AllowAny]

    @extend_schema(
        request=UserRegistrationSerializer,
        responses={
            201: OpenApiResponse(
                response=TokenSerializer,
                description="User registered successfully"
            ),
            400: OpenApiResponse(description="Validation error")
        },
        description="Register a new user and return JWT tokens"
    )
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    'user': UserProfileSerializer(user, context={'request': request}).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    }
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    API endpoint for user login
    """
    permission_classes = [AllowAny]

    @extend_schema(
        request=UserLoginSerializer,
        responses={
            200: OpenApiResponse(
                response=TokenSerializer,
                description="Login successful"
            ),
            401: OpenApiResponse(description="Invalid credentials")
        },
        description="Login user and return JWT tokens"
    )
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(username=username, password=password)
            
            if user is not None:
                if not user.is_active:
                    return Response(
                        {'error': 'User account is disabled.'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        'user': UserProfileSerializer(user, context={'request': request}).data,
                        'tokens': {
                            'access': str(refresh.access_token),
                            'refresh': str(refresh),
                        }
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Invalid username or password.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    API endpoint for user logout (blacklist refresh token)
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'refresh': {'type': 'string', 'description': 'Refresh token to blacklist'}
                },
                'required': ['refresh']
            }
        },
        responses={
            205: OpenApiResponse(description="Logout successful"),
            400: OpenApiResponse(description="Invalid token")
        },
        description="Blacklist refresh token to logout user"
    )
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {'message': 'Logout successful.'},
                status=status.HTTP_205_RESET_CONTENT
            )
        except TokenError as e:
            return Response(
                {'error': 'Invalid or expired token.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'An error occurred during logout.'},
                status=status.HTTP_400_BAD_REQUEST
            )


class CurrentUserView(APIView):
    """
    API endpoint to get current authenticated user
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=UserProfileSerializer,
                description="Current user data"
            ),
            401: OpenApiResponse(description="Not authenticated")
        },
        description="Get current authenticated user information"
    )
    def get(self, request):
        serializer = UserProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserProfileView(RetrieveUpdateAPIView):
    """
    API endpoint to view and update own profile
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == 'PATCH' or self.request.method == 'PUT':
            return UserUpdateSerializer
        return UserProfileSerializer

    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=UserProfileSerializer,
                description="User profile"
            ),
            401: OpenApiResponse(description="Not authenticated")
        },
        description="Get own user profile"
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        request=UserUpdateSerializer,
        responses={
            200: OpenApiResponse(
                response=UserProfileSerializer,
                description="Profile updated successfully"
            ),
            400: OpenApiResponse(description="Validation error"),
            401: OpenApiResponse(description="Not authenticated")
        },
        description="Update own user profile"
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.save()


class UserDetailView(RetrieveAPIView):
    """
    API endpoint to view public user profile by ID
    """
    permission_classes = [AllowAny]
    serializer_class = PublicUserSerializer
    queryset = User.objects.filter(is_active=True)
    lookup_field = 'id'

    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=PublicUserSerializer,
                description="Public user profile"
            ),
            404: OpenApiResponse(description="User not found")
        },
        description="Get public user profile by ID",
        parameters=[
            OpenApiParameter(
                name='id',
                type=int,
                location=OpenApiParameter.PATH,
                description='User ID'
            )
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


# Listing Views

class ListingPagination(PageNumberPagination):
    """
    Pagination for listings - 12 items per page
    """
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


class CategoryListView(generics.ListAPIView):
    """
    API endpoint to list all categories
    """
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=CategorySerializer(many=True),
                description="List of categories"
            )
        },
        description="Get list of all categories"
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ListingListView(generics.ListAPIView):
    """
    API endpoint to list listings with filtering, search and sorting
    """
    permission_classes = [AllowAny]
    serializer_class = ListingListSerializer
    pagination_class = ListingPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ListingFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Return approved listings for regular users, all for staff/moderators
        """
        user = self.request.user
        if user.is_authenticated and (user.is_staff or user.is_moderator):
            return Listing.objects.select_related('category', 'author').prefetch_related('images')
        return Listing.objects.filter(status='approved').select_related('category', 'author').prefetch_related('images')

    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=ListingListSerializer(many=True),
                description="Paginated list of listings"
            )
        },
        parameters=[
            OpenApiParameter(name='category', type=int, description='Filter by category ID'),
            OpenApiParameter(name='min_price', type=float, description='Minimum price'),
            OpenApiParameter(name='max_price', type=float, description='Maximum price'),
            OpenApiParameter(name='search', type=str, description='Search in title and description'),
            OpenApiParameter(name='ordering', type=str, description='Sort by: created_at, -created_at, price, -price'),
        ],
        description="Get paginated list of listings with filters"
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ListingDetailView(generics.RetrieveAPIView):
    """
    API endpoint to get single listing details
    """
    permission_classes = [AllowAny]
    serializer_class = ListingDetailSerializer
    lookup_field = 'id'

    def get_queryset(self):
        """
        Return approved listings or own listings for authenticated users
        """
        user = self.request.user
        if user.is_authenticated:
            # Show approved listings + own listings + all listings for staff/moderators
            if user.is_staff or user.is_moderator:
                return Listing.objects.select_related('category', 'author').prefetch_related('images')
            return Listing.objects.filter(
                Q(status='approved') | Q(author=user)
            ).select_related('category', 'author').prefetch_related('images')
        return Listing.objects.filter(status='approved').select_related('category', 'author').prefetch_related('images')

    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=ListingDetailSerializer,
                description="Listing details"
            ),
            404: OpenApiResponse(description="Listing not found")
        },
        description="Get single listing details"
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ListingCreateView(generics.CreateAPIView):
    """
    API endpoint to create new listing
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ListingCreateSerializer

    @extend_schema(
        request=ListingCreateSerializer,
        responses={
            201: OpenApiResponse(
                response=ListingDetailSerializer,
                description="Listing created successfully"
            ),
            400: OpenApiResponse(description="Validation error"),
            401: OpenApiResponse(description="Not authenticated")
        },
        description="Create new listing (authenticated users only)"
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Return detailed serializer
        detail_serializer = ListingDetailSerializer(
            serializer.instance,
            context={'request': request}
        )
        headers = self.get_success_headers(detail_serializer.data)
        return Response(
            detail_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class ListingUpdateView(generics.UpdateAPIView):
    """
    API endpoint to update own listing
    """
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
    serializer_class = ListingUpdateSerializer
    lookup_field = 'id'

    def get_queryset(self):
        """
        Users can only update their own listings
        """
        return Listing.objects.filter(author=self.request.user)

    @extend_schema(
        request=ListingUpdateSerializer,
        responses={
            200: OpenApiResponse(
                response=ListingDetailSerializer,
                description="Listing updated successfully"
            ),
            400: OpenApiResponse(description="Validation error"),
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not the author"),
            404: OpenApiResponse(description="Listing not found")
        },
        description="Update own listing (authenticated users only)"
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        # Return detailed serializer
        detail_serializer = ListingDetailSerializer(
            serializer.instance,
            context={'request': request}
        )
        return Response(detail_serializer.data)


class ListingDeleteView(generics.DestroyAPIView):
    """
    API endpoint to delete own listing
    """
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
    lookup_field = 'id'

    def get_queryset(self):
        """
        Users can only delete their own listings
        """
        return Listing.objects.filter(author=self.request.user)

    @extend_schema(
        responses={
            204: OpenApiResponse(description="Listing deleted successfully"),
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not the author"),
            404: OpenApiResponse(description="Listing not found")
        },
        description="Delete own listing (authenticated users only)"
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class MyListingsView(generics.ListAPIView):
    """
    API endpoint to get current user's listings with all statuses
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ListingListSerializer
    pagination_class = ListingPagination

    def get_queryset(self):
        """
        Return current user's listings
        """
        return Listing.objects.filter(
            author=self.request.user
        ).select_related('category', 'author').prefetch_related('images')

    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=ListingListSerializer(many=True),
                description="List of user's listings"
            ),
            401: OpenApiResponse(description="Not authenticated")
        },
        description="Get current user's listings with all statuses"
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
