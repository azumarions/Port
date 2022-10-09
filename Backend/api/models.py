from tabnanny import verbose
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings

def upload_avatar_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['avatars', str(instance.userProfile.id)+str(instance.name)+str(".")+str(ext)])

def upload_animal_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['animal', str(instance.animal.id)+str(instance.name)+str(".")+str(ext)])

class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('email is must')

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using= self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email


class Profile(models.Model):
    userProfile = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name='userProfile',
        on_delete=models.CASCADE
    )
    name = models.CharField(verbose_name='名前', max_length=50)
    statusMessage = models.CharField(verbose_name='ステータスメッセージ', max_length=255, blank=True, null=True)
    description = models.TextField(verbose_name='概要', max_length=1000, blank=True, null=True)
    img = models.ImageField(verbose_name='画像', blank=True, null=True, upload_to=upload_avatar_path)
    created_at = models.DateTimeField(verbose_name='作成日', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日', auto_now=True)

    def __str__(self):
        return self.name


class Animal(models.Model):
    SEX_CHOICES = (
        (1, 'オス'),
        (2, 'メス'),
    )

    animal = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='animal',
        on_delete=models.CASCADE
    )
    name = models.CharField(verbose_name='名前', max_length=50)
    description = models.TextField(verbose_name='概要', max_length=1000, blank=True, null=True)
    img = models.ImageField(verbose_name='画像', blank=True, null=True, upload_to=upload_animal_path)
    age = models.IntegerField(verbose_name='年齢')
    kind = models.CharField(verbose_name='品種', max_length=50, blank=True, null=True)
    sex = models.IntegerField(verbose_name='性別', choices=SEX_CHOICES)
    birthDate = models.DateField(verbose_name='生年月日')
    birthPlace = models.CharField(verbose_name='出生地', max_length=50)
    height = models.IntegerField(verbose_name='身長')
    weight = models.IntegerField(verbose_name='体重')
    kategory = models.CharField(verbose_name='カテゴリー', max_length=50)
    created_at = models.DateTimeField(verbose_name='作成日', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日', auto_now=True)
    liked = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked',blank=True)

    def __str__(self):
        return self.name


class Comment(models.Model):
    text = models.CharField(max_length=100)
    comment = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='comment',
        on_delete=models.CASCADE
    )
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)

    def __str__(self):
        return self.text