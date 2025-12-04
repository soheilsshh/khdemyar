from django.db import models


class News(models.Model):
    title = models.CharField(max_length=200, verbose_name="عنوان")
    date = models.DateField(verbose_name="تاریخ")
    description = models.TextField(verbose_name="توضیحات")
    image = models.ImageField(upload_to="news/", verbose_name="تصویر")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "خبر"
        verbose_name_plural = "اخبار"
        ordering = ['-date']

    def __str__(self):
        return self.title
