from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
from model_utils.fields import StatusField
from model_utils import Choices


class UserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = models.CharField(_('username'), max_length=150, blank=True)
    email = models.EmailField(_('email address'), unique=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

# Create your models here.

class Setlist(models.Model):
    STATUS = Choices('using', 'notUsing')
    workTime = models.IntegerField(null=False)
    restTime = models.IntegerField(null=False)
    cycleNumber = models.IntegerField(null=False)
    longRestTime= models.IntegerField(null=False)
    status = StatusField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Record(models.Model):
    date = models.DateTimeField(blank = True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    setlist = models.ForeignKey(Setlist, on_delete=models.CASCADE)

    # viewにxdayのrecordを渡すためのメソッドの記述
    # @classmethod
    # def getXdayRecord(cls):
    #     xdayRecord = cls.objects.filter(\
    #         xday = date.xxx()
    #         )
    #     return xdayRecord



