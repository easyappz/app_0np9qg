from django.core.management.base import BaseCommand
from api.models import Category


class Command(BaseCommand):
    help = 'Create initial categories for the listings board'

    def handle(self, *args, **options):
        categories = [
            {'name': 'Электроника', 'slug': 'electronics'},
            {'name': 'Недвижимость', 'slug': 'real-estate'},
            {'name': 'Транспорт', 'slug': 'vehicles'},
            {'name': 'Услуги', 'slug': 'services'},
            {'name': 'Одежда и обувь', 'slug': 'clothing'},
            {'name': 'Дом и сад', 'slug': 'home-garden'},
            {'name': 'Хобби и отдых', 'slug': 'hobbies'},
            {'name': 'Работа', 'slug': 'jobs'},
            {'name': 'Животные', 'slug': 'animals'},
            {'name': 'Другое', 'slug': 'other'},
        ]

        created_count = 0
        for category_data in categories:
            category, created = Category.objects.get_or_create(
                slug=category_data['slug'],
                defaults={'name': category_data['name']}
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created category: {category.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Category already exists: {category.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nTotal categories created: {created_count}')
        )
