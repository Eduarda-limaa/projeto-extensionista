# app/views.py
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.decorators import api_view
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.dateparse import parse_datetime
from django.db import models


from .models import Produto, Movimentacao
from .serializers import ProdutoSerializer, MovimentacaoSerializer

# -------- produto  --------
class ListCreateProduto(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProdutoSerializer
    queryset = Produto.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo']  # filtro exato por tipo
    search_fields = ['nome']     # busca por nome (partial)
    ordering_fields = ['nome', 'quantidade', 'data_cadastro']

    def get_queryset(self):
        qs = Produto.objects.filter(is_active=True)
        quantidade_min = self.request.query_params.get('quantidade_min')
        quantidade_max = self.request.query_params.get('quantidade_max')
        critical = self.request.query_params.get('critical')

        if quantidade_min is not None:
            try:
                qs = qs.filter(quantidade__gte=int(quantidade_min))
            except ValueError:
                pass

        if quantidade_max is not None:
            try:
                qs = qs.filter(quantidade__lte=int(quantidade_max))
            except ValueError:
                pass

        if critical is not None:
            if critical.lower() in ['1', 'true', 'yes']:
                qs = qs.filter(quantidade__lt=models.F('estoque_minimo'))

        return qs


class RetrieveUpdateDestroyProduto(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProdutoSerializer
    queryset = Produto.objects.filter(is_active=True)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# -------- movimentação do historico --------
class MovimentacaoViewSet(viewsets.ModelViewSet):
    queryset = Movimentacao.objects.all().order_by('-data_operacao')
    serializer_class = MovimentacaoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['produto', 'responsavel', 'tipo']
    search_fields = []
    ordering_fields = ['data_operacao', 'quantidade']

    def get_queryset(self):
        qs = Movimentacao.objects.all().order_by('-data_operacao')
        produto = self.request.query_params.get('produto')
        responsavel = self.request.query_params.get('responsavel')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')

        if produto is not None:
            qs = qs.filter(produto_id=produto)

        if responsavel is not None:
            qs = qs.filter(responsavel_id=responsavel)

        if date_from:
            try:
                start = parse_datetime(date_from) or parse_datetime(date_from + "T00:00:00")
                if start:
                    qs = qs.filter(data_operacao__gte=start)
            except Exception:
                pass

        if date_to:
            try:
                end = parse_datetime(date_to) or parse_datetime(date_to + "T23:59:59")
                if end:
                    qs = qs.filter(data_operacao__lte=end)
            except Exception:
                pass

        return qs

    def create(self, request, *args, **kwargs):
        serializer = MovimentacaoSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        dados = serializer.validated_data

        produto = dados["produto"]
        quantidade = dados["quantidade"]
        tipo = dados["tipo"]

        # entrada
        if tipo == "ENTRADA":
            produto.quantidade += quantidade

        # saída
        elif tipo == "SAIDA":
            if produto.quantidade < quantidade:
                return Response(
                    {"erro": "Estoque insuficiente."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            produto.quantidade -= quantidade

        produto.save()
        movimentacao = serializer.save()

        return Response(
            MovimentacaoSerializer(movimentacao).data,
            status=status.HTTP_201_CREATED
        )


@api_view(['GET'])
def tipos_produto(request):
    tipos = [
        {"value": tipo[0], "label": tipo[1]}
        for tipo in Produto.TIPOS
    ]
    return Response(tipos)