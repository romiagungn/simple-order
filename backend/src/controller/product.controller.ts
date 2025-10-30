import { Request, Response } from 'express';
import { sendApiResponse, ApiResponseCode } from '@/lib/response.util';
import * as productService from '../services/product.service';

export const getProducts = async (req: Request, res: Response) => {
   try {
      const products = await productService.getAllProducts();
       console.log("Product Response:", products);

      return sendApiResponse(
         res,
         200,
         ApiResponseCode.SUCCESS,
         'Data produk berhasil diambil.',
         products,
      );
   } catch (error) {
      console.error('Get products error:', error);
      return sendApiResponse(
         res,
         500,
         ApiResponseCode.INTERNAL_ERROR,
         'Gagal mengambil data produk.',
      );
   }
};

export const createProduct = async (req: Request, res: Response) => {
   try {
      const { name, price, stock } = req.body;

      const newProductData: productService.NewProductData = {
         name,
         price: parseFloat(price),
         stock: parseInt(stock, 10),
      };

      const product = await productService.createProduct(newProductData);

      return sendApiResponse(
         res,
         201,
         ApiResponseCode.CREATED,
         'Produk berhasil ditambahkan.',
         product,
      );
   } catch (error: any) {
      console.error('Create product error:', error);
      return sendApiResponse(
         res,
         500,
         ApiResponseCode.INTERNAL_ERROR,
         'Gagal menambahkan produk.',
         { error: error.message },
      );
   }
};
