from rest_framework import serializers
from .models import Produto, Movimentacao
from datetime import date



class ProdutoSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)

    alerta_estoque = serializers.SerializerMethodField()
    alerta_validade = serializers.SerializerMethodField()
    dias_para_vencer = serializers.SerializerMethodField()

    class Meta:
        model = Produto
        fields = '__all__'
        read_only_fields = ['data_cadastro']

    #  ESTOQUE
    def get_alerta_estoque(self, obj):
        if obj.quantidade <= obj.estoque_minimo:
            return {
                "nivel": "critico",
                "mensagem": "Estoque baixo"
            }
        return {
            "nivel": "ok",
            "mensagem": None
        }

    #  VALIDADE
    def get_alerta_validade(self, obj):
        if obj.validade:
            dias = (obj.validade - date.today()).days

            if dias < 0:
                return {
                    "nivel": "vencido",
                    "mensagem": "Produto vencido"
                }
            elif dias <= 7:
                return {
                    "nivel": "alerta",
                    "mensagem": f"Vence em {dias} dias"
                }

        return {
            "nivel": "ok",
            "mensagem": None
        }

    def get_dias_para_vencer(self, obj):
        if obj.validade:
            return (obj.validade - date.today()).days
        return None


class MovimentacaoSerializer(serializers.ModelSerializer):
    responsavel = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Movimentacao
        fields = '__all__'
        read_only_fields = ['responsavel', 'data_operacao']

    def create(self, validated_data):
        request = self.context.get('request')
        user = getattr(request, 'user', None)

        movimentacao = Movimentacao.objects.create(
            responsavel=user,
            **validated_data
        )

        return movimentacao
