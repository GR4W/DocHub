# -*- coding: utf-8 -*-
from __future__ import unicode_literals


import json
from django.db import models
from django.urls import reverse
from django.conf import settings


class Thread(models.Model):
    # Possible placement options
    PLACEMENT_OPTS = {'page-no': int}

    name = models.CharField(max_length=255)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)
    placement = models.TextField(default="", blank=True)

    course = models.ForeignKey('catalog.Course', on_delete=models.CASCADE)
    document = models.ForeignKey('documents.Document', null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def fullname(self):
        return self.__str__()

    @property
    def page_no(self):
        if self.placement:
            placement = json.loads(self.placement)
            if 'page-no' in placement:
                return placement['page-no']
        return None

    def get_absolute_url(self):
        return reverse('thread_show', args=(self.id, ))

    class Meta:
        ordering = ['-created']


class Message(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    thread = models.ForeignKey(Thread, db_index=True, on_delete=models.CASCADE)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text

    def fullname(self):
        return "un message"

    def get_absolute_url(self):
        return reverse('thread_show', args=(self.thread_id, )) + "#message-{}".format(self.id)
