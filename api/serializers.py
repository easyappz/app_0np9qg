import re
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.tokens import RefreshToken

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
