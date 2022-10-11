from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile, Animal, Comment

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ('id','email','password')
        extra_kwargs= {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    class Meta:
        model = Profile
        fields = ('id', 'userProfile', 'name', 'statusMessage', 'description', 'img', 'created_at', 'updated_at')
        extra_kwargs = {'userProfile': {'read_only': True}}


class AnimalSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    class Meta:
        model = Animal
        fields = ('id', 'animal', 'name', 'description', 'img', 'age', 'kind', 'sex', 'birthDate', 'birthPlace', 'height', 'weight', 'kategory', 'created_at', 'updated_at','liked')
        extra_kwargs = {'animal': {'read_only': True}}

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'text', 'comment','animal')
        extra_kwargs = {'comment': {'read_only': True}}