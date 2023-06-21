import React from 'react'
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"
import { stripe } from '../../lib/stripe';
import { GetStaticPaths, GetStaticProps } from 'next';
import Stripe from 'stripe';
import { priceFormatter } from '../../utils/priceFormatter';
import Image from 'next/image';
import axios from 'axios';

interface ProductDetail {
  productDetail: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    priceId: string;
  }
}

export default function Product({ productDetail }: ProductDetail) {
  async function handleBuyProduct() {
    try {
      const response = await axios.post('/api/product', {
        priceId: productDetail.priceId
      })

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (error) {
      alert('Falha ao redirecionar')
    }
  }

  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={productDetail.imageUrl} width={520} height={480} alt='' />
      </ImageContainer>

      <ProductDetails>
        <h1>{productDetail.name}</h1>
        <span>{productDetail.price}</span>

        <p>{productDetail.description}</p>

        <button onClick={handleBuyProduct}>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        // renderiza uma rota de forma estatica
        params: { id: 'prod_O7gG6pvZF86yg8' }
      }
    ],

    //  apágina que não foi registrada para ser renderizada só tem seu conteudo quando carregar o getStaticProps
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params.id;

  const response = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  });

  const productPrice = response.default_price as Stripe.Price;

  const productDetail = {
    id: response.id,
    name: response.name,
    imageUrl: response.images[0],
    price: priceFormatter.format(productPrice.unit_amount / 100),
    description: response.description,
    priceId: productPrice.id,
  }

  return {
    props: {
      productDetail,
    },

    revalidate: 60 * 60 * 1,
  }
}