from django.db import models
from decimal import Decimal
from django.contrib.auth.models import User


class Produto(models.Model):
    TIPOS = [
        ('PICOLE', 'Picole'),
        ('PALETA ', 'Paleta'),
        ('MORENINHA', 'Moreninha'),
        ('COBERTURA', 'Cobertura'),
        ('CASQUINHA', 'Casquinha'),
        ('CASCÃO', 'Cascão'),
        ('MELHORADO 300ML', 'Melhorado 300ml'),
        ('MELHORADO 500ML', 'Melhorado 500ml'),
        ('MELHORADO 1L', 'Melhorado 1l'),
        ('FONDUE PEQUENO', 'Fondue pequeno'),
        ('FONDUE GRANDE', 'Fondue grande'),
        ('AÇAI NO COPO 300ML', 'Açai no copo 300ml'),
        ('AÇAI NO COPO 400ML', 'Açai no copo 400ml'),
        ('AÇAI NO COPO 500ML', 'Açai no copo 500ml'),
        ('AÇAI NO COPO 700ML', 'Açai no copo 700ml'),
        ('POTE AÇAI 1L COM ACOMPANHAMENTOS', 'Pote açai 1l com companhamentos'),
        ('POTE AÇAI 2L COM ACOMPANHAMENTOS', 'Pote açai 2l com companhamentos'),
        ('POTE AÇAI 1L', 'Pote açai 1l'),
        ('POTE AÇAI 2L', 'Pote açai 2l'),
        ('POTE CUPUAÇU 1L', 'Pote cupuaçu 1l'),
        ('POTE SORVETE 1,5L', 'Pote sorvete 1,5l'),
        ('POTE SORVETE 2L', 'Pote sorvete 2l'),
        ('SKIMO', 'Skimo'),
        ('ÁGUA S/GÁS', 'Água s/gás'),
        ('ÁGUA C/GÁS', 'Água c/gás'),
        ('CESTINHA', 'Cestinha'),
    ]

    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=100, choices=TIPOS)
    quantidade = models.IntegerField()
    preco_de_custo = models.DecimalField(max_digits=10, decimal_places=2)
    preco_de_venda = models.DecimalField(max_digits=10, decimal_places=2)
    estoque_minimo = models.IntegerField()
    validade = models.DateField(null=True, blank=True)
    data_cadastro = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True) # exclusão lógica 

    def __str__(self):
        return f"{self.nome} ({self.get_tipo_display()})"



class Movimentacao(models.Model):
    TIPO_MOV = [
        ('ENTRADA', 'Entrada'),
        ('SAIDA', 'Saída'),
    ]

    produto = models.ForeignKey(
        Produto,
        on_delete=models.CASCADE,
        related_name="movimentacoes"
    )

    tipo = models.CharField(max_length=10, choices=TIPO_MOV)
    quantidade = models.IntegerField()
    responsavel =  models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    data_operacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo} de {self.quantidade} un. - {self.produto.nome}"
