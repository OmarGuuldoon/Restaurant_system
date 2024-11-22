import 'dotenv/config';
import db_connection from '../configuration.js';

const getDetails = async (req, res, next) => {
  let data = {};

  try {
    // Fetch category count
    const categoryQuery = "SELECT COUNT(id) AS categoryCount FROM category";
    const [categoryResult] = await db_connection.query(categoryQuery);
    data.categoryCount = categoryResult[0].categoryCount;

    // Fetch product count
    const productQuery = "SELECT COUNT(id) AS productCount FROM product";
    const [productResult] = await db_connection.query(productQuery);
    data.productCount = productResult[0].productCount;

    // Fetch bill count
    const billQuery = "SELECT COUNT(id) AS billCount FROM bill";
    const [billResult] = await db_connection.query(billQuery);
    data.billCount = billResult[0].billCount;

    // Return the flat data object directly
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error fetching details:', error.message);
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: error.message,
    });
  }
};

export default { getDetails };
