from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from api.models import User, Category, Listing, ListingImage


class ListingImageInline(admin.TabularInline):
    model = ListingImage
    extra = 1
    max_num = 5
    fields = ["image", "order", "image_preview"]
    readonly_fields = ["image_preview", "uploaded_at"]

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Превью"


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["username", "email", "first_name", "last_name", "phone", "is_moderator", "date_joined"]
    list_filter = ["is_moderator", "is_staff", "is_superuser", "is_active", "date_joined"]
    search_fields = ["username", "email", "first_name", "last_name", "phone"]
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Дополнительная информация", {"fields": ("phone", "avatar", "is_moderator")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Дополнительная информация", {"fields": ("phone", "avatar", "is_moderator")}),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "listings_count", "created_at"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ["created_at"]

    def listings_count(self, obj):
        return obj.listings.count()
    listings_count.short_description = "Количество объявлений"


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "category", "price", "status", "created_at"]
    list_filter = ["status", "category", "created_at"]
    search_fields = ["title", "description", "author__username"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [ListingImageInline]
    fieldsets = (
        ("Основная информация", {
            "fields": ("title", "description", "price", "category", "author")
        }),
        ("Контактные данные", {
            "fields": ("author_phone", "author_email")
        }),
        ("Модерация", {
            "fields": ("status",)
        }),
        ("Метаданные", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )
    actions = ["approve_listings", "reject_listings"]

    def approve_listings(self, request, queryset):
        updated = queryset.update(status="approved")
        self.message_user(request, f"Одобрено объявлений: {updated}")
    approve_listings.short_description = "Одобрить выбранные объявления"

    def reject_listings(self, request, queryset):
        updated = queryset.update(status="rejected")
        self.message_user(request, f"Отклонено объявлений: {updated}")
    reject_listings.short_description = "Отклонить выбранные объявления"


@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ["listing", "order", "image_preview", "uploaded_at"]
    list_filter = ["uploaded_at"]
    search_fields = ["listing__title"]
    readonly_fields = ["image_preview", "uploaded_at"]

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Превью"
