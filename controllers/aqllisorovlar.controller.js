const sequelize = require("../config/db");

const getClientPayments = async (req, res) => {
  try {
    const { first_name, phone_number } = req.body;

    const results = await sequelize.query(
      `
      SELECT 
        cat.name AS category_name,
        p.name AS product_name,
        o.first_name || ' ' || o.last_name AS owner_name,
        pay.amount,
        pay.payment_date,
        pay.status
      FROM payments pay
      JOIN contracts c ON pay.contract_id = c.id
      JOIN prod p ON c.product_id = p.id
      JOIN categories cat ON p.category_id = cat.id
      JOIN owners o ON p.owner_id = o.id
      JOIN clients cl ON c.client_id = cl.id
      WHERE cl.first_name = :first_name AND cl.phone_number = :phone_number
      `,
      {
        replacements: { first_name, phone_number },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getTopOwnersCategory = async (req, res) => {
  try {
    const category_id = req.params.id;

    const results = await sequelize.query(
      `
      SELECT 
        o.first_name AS owner_name,
        COUNT(*) AS rental_count
      FROM contracts c
      JOIN prod p ON c.product_id = p.id
      JOIN owners o ON p.owner_id = o.id
      WHERE p.category_id = :category_id
      GROUP BY o.first_name
      ORDER BY rental_count DESC
      `,
      {
        replacements: { category_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({ owners: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRentedProductsByDate = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const results = await sequelize.query(
      `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        c.start_date,
        c.end_date
      FROM contracts c
      JOIN prod p ON c.product_id = p.id
      WHERE c.start_date >= :start_date AND c.end_date <= :end_date
      `,
      {
        replacements: { start_date, end_date },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDamagedProductsClients = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const results = await sequelize.query(
      `
      SELECT 
        cl.id AS client_id,
        cl.first_name,
        cl.last_name,
        s.name AS status_name
      FROM contracts c
      JOIN clients cl ON c.client_id = cl.id
      JOIN status s ON c.status_id = s.id
      WHERE s.name = 'Damaged'
        AND c.start_date >= :start_date 
        AND c.end_date <= :end_date
      `,
      {
        replacements: { start_date, end_date },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getCancelledContractsClients = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const results = await sequelize.query(
      `
      SELECT 
        cl.id AS client_id,
        cl.first_name,
        cl.last_name,
        s.name AS status
      FROM contracts c
      JOIN clients cl ON c.client_id = cl.id
      JOIN status s ON c.status_id = s.id
      WHERE s.name = 'Cancelled'
        AND c.created_at >= :start_date AND c.created_at <= :end_date
      `,
      {
        replacements: { start_date, end_date },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getClientPayments,
  getTopOwnersCategory,
  getRentedProductsByDate,
  getDamagedProductsClients,
  getCancelledContractsClients,
};
