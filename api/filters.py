from django_filters import rest_framework as filters
from .models import Listing


class ListingFilter(filters.FilterSet):
    """
    Filter for listings with category and price range
    """
    category = filters.NumberFilter(field_name='category__id')
    min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')

    class Meta:
        model = Listing
        fields = ['category', 'min_price', 'max_price']
