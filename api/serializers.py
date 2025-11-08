import re
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Listing, ListingImage, Category

User = get_user_model()


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This email is already registered.")]
    )
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This username is already taken.")]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=20)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone')

    def validate_phone(self, value):
        """
        Validate phone number format
        """
        if value:
            # Remove spaces and dashes
            cleaned = re.sub(r'[\s-]', '', value)
            # Check if it contains only digits, +, (, )
            if not re.match(r'^[\d+()]+$', cleaned):
                raise serializers.ValidationError("Phone number can only contain digits, +, (, ) characters.")
            # Check length
            digits_only = re.sub(r'[^\d]', '', cleaned)
            if len(digits_only) < 10 or len(digits_only) > 15:
                raise serializers.ValidationError("Phone number must contain 10-15 digits.")
        return value

    def validate(self, attrs):
        """
        Validate that passwords match
        """
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."}, code='password_mismatch')
        return attrs

    def create(self, validated_data):
        """
        Create and return a new user
        """
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', '')
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile with listings count
    """
    listings_count = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 
            'phone', 'avatar', 'avatar_url', 'date_joined', 'listings_count'
        )
        read_only_fields = ('id', 'username', 'date_joined')

    def get_listings_count(self, obj):
        """
        Get count of user's approved listings
        """
        return obj.listings.filter(status='approved').count()

    def get_avatar_url(self, obj):
        """
        Get full URL for avatar
        """
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile
    """
    email = serializers.EmailField(required=False)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'phone', 'email', 'avatar')

    def validate_phone(self, value):
        """
        Validate phone number format
        """
        if value:
            cleaned = re.sub(r'[\s-]', '', value)
            if not re.match(r'^[\d+()]+$', cleaned):
                raise serializers.ValidationError("Phone number can only contain digits, +, (, ) characters.")
            digits_only = re.sub(r'[^\d]', '', cleaned)
            if len(digits_only) < 10 or len(digits_only) > 15:
                raise serializers.ValidationError("Phone number must contain 10-15 digits.")
        return value

    def validate_email(self, value):
        """
        Validate that email is unique (excluding current user)
        """
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value


class PublicUserSerializer(serializers.ModelSerializer):
    """
    Serializer for public user profile view
    """
    listings_count = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 
            'avatar_url', 'date_joined', 'listings_count'
        )
        read_only_fields = fields

    def get_listings_count(self, obj):
        """
        Get count of user's approved listings
        """
        return obj.listings.filter(status='approved').count()

    def get_avatar_url(self, obj):
        """
        Get full URL for avatar
        """
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class TokenSerializer(serializers.Serializer):
    """
    Serializer for JWT token response
    """
    access = serializers.CharField()
    refresh = serializers.CharField()


# Listing Serializers

class ListingImageSerializer(serializers.ModelSerializer):
    """
    Serializer for listing images
    """
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ListingImage
        fields = ('id', 'image', 'image_url', 'order')
        read_only_fields = ('id', 'image_url')

    def get_image_url(self, obj):
        """
        Get full URL for image
        """
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for categories
    """
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')
        read_only_fields = ('id', 'slug')


class ListingAuthorSerializer(serializers.ModelSerializer):
    """
    Serializer for listing author with contact information
    """
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'avatar_url')
        read_only_fields = fields

    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class ListingListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing list view
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.SerializerMethodField()
    first_image = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = (
            'id', 'title', 'price', 'category_name', 'first_image',
            'author_name', 'status', 'created_at'
        )
        read_only_fields = fields

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username

    def get_first_image(self, obj):
        first_image = obj.images.first()
        if first_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        return None


class ListingDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for listing detail view
    """
    images = ListingImageSerializer(many=True, read_only=True)
    author = ListingAuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Listing
        fields = (
            'id', 'title', 'description', 'price', 'category',
            'author', 'status', 'author_phone', 'author_email',
            'images', 'created_at', 'updated_at'
        )
        read_only_fields = fields


class ListingCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating listings
    """
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        allow_empty=True,
        max_length=5
    )

    class Meta:
        model = Listing
        fields = (
            'title', 'description', 'price', 'category',
            'author_phone', 'author_email', 'images'
        )

    def validate_images(self, value):
        """
        Validate that max 5 images are uploaded
        """
        if len(value) > 5:
            raise serializers.ValidationError("Maximum 5 images allowed.")
        return value

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        # Set author from request context
        validated_data['author'] = self.context['request'].user
        # Status is set to pending by default in model
        listing = Listing.objects.create(**validated_data)

        # Create images
        for index, image_data in enumerate(images_data):
            ListingImage.objects.create(
                listing=listing,
                image=image_data,
                order=index
            )

        return listing


class ListingUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating listings
    """
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        allow_empty=True,
        max_length=5
    )
    delete_image_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        allow_empty=True
    )

    class Meta:
        model = Listing
        fields = (
            'title', 'description', 'price', 'category',
            'author_phone', 'author_email', 'images', 'delete_image_ids'
        )

    def validate(self, attrs):
        """
        Validate total images count
        """
        instance = self.instance
        new_images = attrs.get('images', [])
        delete_ids = attrs.get('delete_image_ids', [])

        if instance:
            current_count = instance.images.exclude(id__in=delete_ids).count()
            total_count = current_count + len(new_images)
            if total_count > 5:
                raise serializers.ValidationError(
                    {"images": "Total number of images cannot exceed 5."}
                )

        return attrs

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        delete_image_ids = validated_data.pop('delete_image_ids', [])

        # Update listing fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Set status back to pending when updated
        instance.status = 'pending'
        instance.save()

        # Delete specified images
        if delete_image_ids:
            ListingImage.objects.filter(
                id__in=delete_image_ids,
                listing=instance
            ).delete()

        # Add new images
        if images_data:
            current_max_order = instance.images.aggregate(
                max_order=models.Max('order')
            )['max_order'] or -1

            for index, image_data in enumerate(images_data):
                ListingImage.objects.create(
                    listing=instance,
                    image=image_data,
                    order=current_max_order + index + 1
                )

        return instance
