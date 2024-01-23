import express from 'express';
import Product from '../schemas/products.schema.js';

const router = express.Router();
// 1. 상품 작성 API //
router.post('/products', async (req, res) => {
  const { productName, content, authorName, password } = req.body;

  // 데이터 유효성 검사 기능
  if (!productName || !content || !authorName || !password) {
    return res
      .status(400)
      .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  }

  try {
    const newProduct = new Product({
      productName,
      content,
      authorName,
      password,
      status: 'FOR_SALE',
    });

    await newProduct.save();

    return res.status(201).json({ product: newProduct });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: '상품 등록에 실패하였습니다.' });
  }
});

// 2. 상품 목록 조회 API
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 }) // 최신순으로 정렬
      .select('productName authorName status creatAt'); //데이터를 조회할 때 반환할 필드를 선택하는 것

    return res.status(200).json({ products });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: '상품 목록 조회에 실패하였습니다.' });
  }
});

//3. 상품 상세 조회 API
router.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).select(
      'productName content authorName status createdAt'
    );

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: '상품 조회에 실패하였습니다.' });
    }
    return res.status(200).json({ product });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: '상품 상세 조회에 실패하였습니다.' });
  }
});

// 4. 상품 정보 수정 API
router.put('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const { productName, content, status, password } = req.body;

  try {
    if (!productName || !content || !status || !password) {
      return res
        .status(400)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: '상품 조회에 실패하였습니다.' });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ errorMessage: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    product.productName = productName || product.productName;
    product.content = content || product.content;
    product.status = status || product.status;

    await product.save();

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ error: '상품 정보 수정에 실패하였습니다.' });
  }
});
// 5. 상품 삭제 API
router.delete('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const { password } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: '상품 조회에 실패하셨습니다.' });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ errorMessage: '상품을 삭제할 권한이 존재하지 않습니다.' });
    }
    await product.deleteOne();

    return res.status(200).json({});
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: '상품 삭제에 실패하였습니다.' });
  }
});

export default router;
