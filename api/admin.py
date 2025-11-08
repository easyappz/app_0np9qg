from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

from .models import User, Category, Listing, ListingImage


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User admin
    """
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone', 'is_moderator', 'is_staff', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'is_moderator', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone', 'avatar', 'is_moderator')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('email', 'first_name', 'last_name', 'phone', 'avatar', 'is_moderator')}),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Category admin
    """
    list_display = ('name', 'slug', 'listings_count', 'created_at')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)
    
    def listings_count(self, obj):
        return obj.listings.count()
    listings_count.short_description = 'Listings Count'


class ListingImageInline(admin.TabularInline):
    """
    Inline for listing images
    """
    model = ListingImage
    extra = 1
    max_num = 5
    fields = ('image', 'order', 'image_preview')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 150px;" />', obj.image.url)
        return "-"
    image_preview.short_description = 'Preview'


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    """
    Listing admin with moderation capabilities
    """
    list_display = ('title', 'author', 'category', 'price', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'category', 'created_at', 'updated_at')
    search_fields = ('title', 'description', 'author__username', 'author__email')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ListingImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'price', 'category', 'author')
        }),
        ('Contact Information', {
            'fields': ('author_phone', 'author_email')
        }),
        ('Moderation', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_listings', 'reject_listings', 'set_pending']
    
    def approve_listings(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} listing(s) approved successfully.')
    approve_listings.short_description = 'Approve selected listings'
    
    def reject_listings(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} listing(s) rejected.')
    reject_listings.short_description = 'Reject selected listings'
    
    def set_pending(self, request, queryset):
        updated = queryset.update(status='pending')
        self.message_user(request, f'{updated} listing(s) set to pending.')
    set_pending.short_description = 'Set selected listings to pending'


@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    """
    Listing Image admin
    """
    list_display = ('listing', 'order', 'image_preview', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('listing__title',)
    ordering = ('listing', 'order')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 150px;" />', obj.image.url)
        return "-"
    image_preview.short_description = 'Preview'
