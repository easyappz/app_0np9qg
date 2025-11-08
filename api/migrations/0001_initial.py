# Generated migration file

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('phone', models.CharField(blank=True, help_text='Контактный телефон пользователя', max_length=20, verbose_name='Телефон')),
                ('avatar', models.ImageField(blank=True, help_text='Фотография профиля пользователя', null=True, upload_to='avatars/', verbose_name='Аватар')),
                ('is_moderator', models.BooleanField(default=False, help_text='Является ли пользователь модератором', verbose_name='Модератор')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'Пользователь',
                'verbose_name_plural': 'Пользователи',
                'ordering': ['-date_joined'],
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Название категории', max_length=100, verbose_name='Название')),
                ('slug', models.SlugField(help_text='Уникальный идентификатор категории для URL', unique=True, verbose_name='Слаг')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
            ],
            options={
                'verbose_name': 'Категория',
                'verbose_name_plural': 'Категории',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='Название объявления', max_length=200, verbose_name='Название')),
                ('description', models.TextField(help_text='Подробное описание объявления', verbose_name='Описание')),
                ('price', models.DecimalField(decimal_places=2, help_text='Цена в рублях', max_digits=10, verbose_name='Цена')),
                ('status', models.CharField(choices=[('pending', 'На модерации'), ('approved', 'Одобрено'), ('rejected', 'Отклонено')], default='pending', help_text='Статус модерации объявления', max_length=20, verbose_name='Статус')),
                ('author_phone', models.CharField(help_text='Контактный телефон для связи', max_length=20, verbose_name='Телефон автора')),
                ('author_email', models.EmailField(help_text='Контактный email для связи', max_length=254, verbose_name='Email автора')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата обновления')),
                ('author', models.ForeignKey(help_text='Автор объявления', on_delete=django.db.models.deletion.CASCADE, related_name='listings', to=settings.AUTH_USER_MODEL, verbose_name='Автор')),
                ('category', models.ForeignKey(help_text='Категория объявления', on_delete=django.db.models.deletion.PROTECT, related_name='listings', to='api.category', verbose_name='Категория')),
            ],
            options={
                'verbose_name': 'Объявление',
                'verbose_name_plural': 'Объявления',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ListingImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(help_text='Фотография объявления', upload_to='listings/', verbose_name='Изображение')),
                ('order', models.IntegerField(default=0, help_text='Порядковый номер изображения для сортировки', verbose_name='Порядок')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата загрузки')),
                ('listing', models.ForeignKey(help_text='Объявление, к которому относится изображение', on_delete=django.db.models.deletion.CASCADE, related_name='images', to='api.listing', verbose_name='Объявление')),
            ],
            options={
                'verbose_name': 'Изображение объявления',
                'verbose_name_plural': 'Изображения объявлений',
                'ordering': ['order', 'uploaded_at'],
            },
        ),
        migrations.AddIndex(
            model_name='listing',
            index=models.Index(fields=['-created_at'], name='api_listing_created_4b0b8f_idx'),
        ),
        migrations.AddIndex(
            model_name='listing',
            index=models.Index(fields=['status'], name='api_listing_status_e3b3ef_idx'),
        ),
        migrations.AddIndex(
            model_name='listing',
            index=models.Index(fields=['category'], name='api_listing_categor_88d7bd_idx'),
        ),
        migrations.AddIndex(
            model_name='listing',
            index=models.Index(fields=['price'], name='api_listing_price_4b52e7_idx'),
        ),
    ]
