from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify


class User(AbstractUser):
    """
    Пользовательская модель пользователя
    """
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Телефон",
        help_text="Контактный телефон пользователя"
    )
    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True,
        verbose_name="Аватар",
        help_text="Фотография профиля пользователя"
    )
    is_moderator = models.BooleanField(
        default=False,
        verbose_name="Модератор",
        help_text="Является ли пользователь модератором"
    )

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
        ordering = ["-date_joined"]

    def __str__(self):
        return self.username


class Category(models.Model):
    """
    Категория объявлений
    """
    name = models.CharField(
        max_length=100,
        verbose_name="Название",
        help_text="Название категории"
    )
    slug = models.SlugField(
        unique=True,
        verbose_name="Слаг",
        help_text="Уникальный идентификатор категории для URL"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Listing(models.Model):
    """
    Объявление
    """
    STATUS_CHOICES = [
        ("pending", "На модерации"),
        ("approved", "Одобрено"),
        ("rejected", "Отклонено"),
    ]

    title = models.CharField(
        max_length=200,
        verbose_name="Название",
        help_text="Название объявления"
    )
    description = models.TextField(
        verbose_name="Описание",
        help_text="Подробное описание объявления"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Цена",
        help_text="Цена в рублях"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="listings",
        verbose_name="Категория",
        help_text="Категория объявления"
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="listings",
        verbose_name="Автор",
        help_text="Автор объявления"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
        verbose_name="Статус",
        help_text="Статус модерации объявления"
    )
    author_phone = models.CharField(
        max_length=20,
        verbose_name="Телефон автора",
        help_text="Контактный телефон для связи"
    )
    author_email = models.EmailField(
        verbose_name="Email автора",
        help_text="Контактный email для связи"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата обновления"
    )

    class Meta:
        verbose_name = "Объявление"
        verbose_name_plural = "Объявления"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["-created_at"]),
            models.Index(fields=["status"]),
            models.Index(fields=["category"]),
            models.Index(fields=["price"]),
        ]

    def __str__(self):
        return self.title


class ListingImage(models.Model):
    """
    Изображение объявления
    """
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="Объявление",
        help_text="Объявление, к которому относится изображение"
    )
    image = models.ImageField(
        upload_to="listings/",
        verbose_name="Изображение",
        help_text="Фотография объявления"
    )
    order = models.IntegerField(
        default=0,
        verbose_name="Порядок",
        help_text="Порядковый номер изображения для сортировки"
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата загрузки"
    )

    class Meta:
        verbose_name = "Изображение объявления"
        verbose_name_plural = "Изображения объявлений"
        ordering = ["order", "uploaded_at"]

    def __str__(self):
        return f"Image {self.order} for {self.listing.title}"

    def clean(self):
        # Validation: max 5 images per listing
        if self.listing_id:
            existing_images = ListingImage.objects.filter(listing=self.listing).exclude(pk=self.pk)
            if existing_images.count() >= 5:
                raise ValidationError("Максимальное количество изображений для объявления - 5")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
