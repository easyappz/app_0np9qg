from django.core.management.base import BaseCommand
from api.models import Category


class Command(BaseCommand):
    help = 'Create default categories for the listings board'

    def handle(self, *args, **options):
        categories = [
            {'name': 'Электроника', 'slug': 'elektronika'},
            {'name': 'Недвижимость', 'slug': 'nedvizhimost'},
            {'name': 'Транспорт', 'slug': 'transport'},
            {'name': 'Услуги', 'slug': 'uslugi'},
            {'name': 'Для дома и дачи', 'slug': 'dlya-doma-i-dachi'},
            {'name': 'Одежда и обувь', 'slug': 'odezhda-i-obuv'},
            {'name': 'Хобби и отдых', 'slug': 'hobbi-i-otdyh'},
            {'name': 'Работа', 'slug': 'rabota'},
            {'name': 'Животные', 'slug': 'zhivotnye'},
            {'name': 'Разное', 'slug': 'raznoe'},
        ]

        created_count = 0
        existing_count = 0

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
                existing_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Category already exists: {category.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSummary: {created_count} created, {existing_count} already existed'
            )
        )
