from django.db import models


# Create your models here.

class ContactUser(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.CharField(max_length=255, null=True, blank=True)
    mobile = models.CharField(max_length=255)
    info = models.TextField(null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name', 'surname']

        def __unicode__(self):
            return self.name
