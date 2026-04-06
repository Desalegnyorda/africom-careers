const vacancyService = require('../../services/vacancy.service');

const vacancyController = {
  // Get all vacancies
  async getAllVacancies(req, res) {
    try {
      const result = await vacancyService.fetchVacancies();
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          source: result.source,
          count: result.data.length
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch vacancies',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error in getAllVacancies:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Sync vacancies from external source
  async syncVacancies(req, res) {
    try {
      const result = await vacancyService.syncVacancies();
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          data: result.data,
          source: result.source,
          count: result.data.length
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error in syncVacancies:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get single vacancy by ID
  async getVacancyById(req, res) {
    try {
      const { id } = req.params;
      const result = await vacancyService.fetchVacancies();
      
      if (result.success) {
        const vacancy = result.data.find(v => v.id === id);
        
        if (vacancy) {
          res.json({
            success: true,
            data: vacancy
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'Vacancy not found'
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch vacancies',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error in getVacancyById:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = vacancyController;
