import django_filters
from .models import Listing


class ListingFilter(django_filters.FilterSet):
    """
    Filter for listings by category and price range
    """
    category = django_filters.NumberFilter(field_name='category__id')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')

    class Meta:
        model = Listing
        fields = ['category', 'min_price', 'max_price']
