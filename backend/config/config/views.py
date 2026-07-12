from rest_framework.permissions import IsAuthenticated

class StockListView(generics.ListCreateAPIView):

    serializer_class = StockSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Stock.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)