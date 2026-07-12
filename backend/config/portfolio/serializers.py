# from django.contrib.auth.models import User
# from rest_framework import serializers
# from .models import Stock


# read_only_fields = ["user"]
# class StockSerializer(serializers.ModelSerializer):

#     invested_amount = serializers.ReadOnlyField()
#     current_value = serializers.ReadOnlyField()
#     profit_loss = serializers.ReadOnlyField()

#     class Meta:
#         model = Stock
#         fields = "__all__"
#         read_only_fields = ["user"]

# class StockSerializer(serializers.ModelSerializer):
#     invested_amount = serializers.ReadOnlyField()
#     current_value = serializers.ReadOnlyField()
#     profit_loss = serializers.ReadOnlyField()

#     class Meta:
#         model = Stock
#         fields = "__all__"


# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields = ["username", "email", "password"]

#     def create(self, validated_data):
#         return User.objects.create_user(
#             username=validated_data["username"],
#             email=validated_data["email"],
#             password=validated_data["password"],
#         )


from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Stock


class StockSerializer(serializers.ModelSerializer):
    invested_amount = serializers.ReadOnlyField()
    current_value = serializers.ReadOnlyField()
    profit_loss = serializers.ReadOnlyField()

    class Meta:
        model = Stock
        fields = "__all__"
        read_only_fields = ["user"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )