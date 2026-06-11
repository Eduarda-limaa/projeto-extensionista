from django.urls import path
from .views import (
    ListCreateProduto,
    RetrieveUpdateDestroyProduto,
    MovimentacaoViewSet
)
from .views import tipos_produto
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

movimentacao_list = MovimentacaoViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

movimentacao_detail = MovimentacaoViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    # token jwt
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # produtos
    path('produto/', view=ListCreateProduto.as_view()),
    path('produto/<int:pk>/', view=RetrieveUpdateDestroyProduto.as_view()),

    path('tipos_produto/', tipos_produto),


    # movimentacao
    path('movimentacao/', movimentacao_list),
    path('movimentacao/<int:pk>/', movimentacao_detail),
]
