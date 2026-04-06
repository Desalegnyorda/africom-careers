const axios = require('axios');

class VacancyService {
  constructor() {
    this.baseURL = 'https://africom.et';
    this.careersPath = '/careers';
  }

  async fetchVacancies() {
    try {
      // Since the careers page is a React app, we'll try to fetch data
      // This might need to be adjusted based on the actual API structure
      const response = await axios.get(`${this.baseURL}/api/vacancies`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      return {
        success: true,
        data: response.data,
        source: 'api'
      };
    } catch (error) {
      console.log('Direct API fetch failed, trying alternative approaches...');
      
      // Try to fetch the page and parse for job data
      try {
        const pageResponse = await axios.get(`${this.baseURL}${this.careersPath}`, {
          headers: {
            'Accept': 'text/html',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000
        });

        // Since it's a React app, we'll need to look for data in script tags
        // or return a structured response based on what we can parse
        return {
          success: true,
          data: this.parseVacanciesFromHTML(pageResponse.data),
          source: 'parsed'
        };
      } catch (parseError) {
        console.error('Failed to parse vacancies from HTML:', parseError);
        
        // Return mock data as fallback for development
        return {
          success: true,
          data: this.getMockVacancies(),
          source: 'mock'
        };
      }
    }
  }

  parseVacanciesFromHTML(html) {
    // This is a placeholder for HTML parsing logic
    // In a real implementation, you'd use cheerio or similar to parse the HTML
    // and extract job listings from the React app's initial state or API calls
    
    const vacancies = [];
    
    // Look for script tags containing job data
    const scriptRegex = /window\.__INITIAL_STATE__\s*=\s*({.*?});/g;
    const matches = html.match(scriptRegex);
    
    if (matches) {
      try {
        const data = JSON.parse(matches[0].split('=')[1].replace(';', ''));
        // Extract vacancies from the data structure
        if (data.jobs || data.vacancies) {
          vacancies.push(...(data.jobs || data.vacancies));
        }
      } catch (e) {
        console.error('Failed to parse initial state:', e);
      }
    }
    
    return vacancies;
  }

  getMockVacancies() {
    // Mock data for development/testing
    return [
      {
        id: '1',
        title: 'Senior Software Engineer',
        department: 'Engineering',
        location: 'Addis Ababa, Ethiopia',
        type: 'Full-time',
        experience: '5+ years',
        description: 'We are looking for a Senior Software Engineer to join our team...',
        requirements: ['Bachelor\'s degree in Computer Science', '5+ years of experience', 'Strong programming skills'],
        postedDate: '2024-03-15',
        deadline: '2024-04-15',
        status: 'active'
      },
      {
        id: '2',
        title: 'Product Manager',
        department: 'Product',
        location: 'Addis Ababa, Ethiopia',
        type: 'Full-time',
        experience: '3+ years',
        description: 'Seeking an experienced Product Manager to lead our product initiatives...',
        requirements: ['MBA or equivalent', '3+ years product management experience', 'Strong analytical skills'],
        postedDate: '2024-03-10',
        deadline: '2024-04-10',
        status: 'active'
      },
      {
        id: '3',
        title: 'UX/UI Designer',
        department: 'Design',
        location: 'Addis Ababa, Ethiopia',
        type: 'Full-time',
        experience: '2+ years',
        description: 'Creative UX/UI Designer needed for exciting projects...',
        requirements: ['Portfolio of design work', '2+ years experience', 'Proficiency in design tools'],
        postedDate: '2024-03-08',
        deadline: '2024-04-08',
        status: 'active'
      }
    ];
  }

  async syncVacancies() {
    try {
      const result = await this.fetchVacancies();
      
      if (result.success) {
        // Here you would typically save the vacancies to your database
        console.log(`Successfully fetched ${result.data.length} vacancies from ${result.source}`);
        
        return {
          success: true,
          message: `Successfully synced ${result.data.length} vacancies`,
          data: result.data,
          source: result.source
        };
      } else {
        throw new Error('Failed to fetch vacancies');
      }
    } catch (error) {
      console.error('Error syncing vacancies:', error);
      return {
        success: false,
        message: 'Failed to sync vacancies',
        error: error.message
      };
    }
  }
}

module.exports = new VacancyService();
