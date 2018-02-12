from django.db import models
from django.core.exceptions import ValidationError


# Create your models here.

class ContactUser(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.CharField(max_length=255, null=True, blank=True)
    mobile = models.CharField(max_length=255)
    info = models.TextField(null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # avoid DB growth on public available APIs

        if len(ContactUser.objects.all()) > 99:
            raise ValidationError(
                'You can have only a maximum of 100 contacts, delete one in order to add/modify a new one.')
        return super(ContactUser, self).save(*args, **kwargs)

    class Meta:
        ordering = ['name', 'surname']

        def __unicode__(self):
            return self.name
