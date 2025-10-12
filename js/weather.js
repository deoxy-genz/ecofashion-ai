// Weather API integration for EcoFashion AI

class WeatherWidget {
    constructor() {
        // Use environment variable or localStorage for API key
        this.apiKey = this.getApiKey();
        this.defaultCity = 'New York';
        this.weatherElement = document.getElementById('weather-widget');
        this.weatherInfo = document.getElementById('weather-info');
        this.useRealAPI = this.apiKey && this.apiKey !== 'YOUR_API_KEY';
        
        this.init();
    }

    getApiKey() {
        // Check for API key in various sources
        return localStorage.getItem('openweather_api_key') || 
               sessionStorage.getItem('openweather_api_key') || 
               'YOUR_API_KEY';
    }

    init() {
        if (this.weatherElement) {
            this.loadWeather();
            // Update weather every 30 minutes
            setInterval(() => this.loadWeather(), 30 * 60 * 1000);
        }
    }

    async loadWeather() {
        try {
            if (this.useRealAPI) {
                // Try to get user's location first for real API
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            this.fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
                        },
                        () => {
                            // Fallback to default city
                            this.fetchWeatherByCity(this.defaultCity);
                        },
                        { timeout: 5000 }
                    );
                } else {
                    this.fetchWeatherByCity(this.defaultCity);
                }
            } else {
                // Use enhanced mock data for demo
                this.showEnhancedMockWeather();
            }
        } catch (error) {
            console.error('Weather loading failed:', error);
            this.showFallbackWeather();
        }
    }

    async fetchWeatherByCoords(lat, lon) {
        if (this.useRealAPI) {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                this.displayWeather(data);
            } catch (error) {
                console.error('Weather API error:', error);
                this.showEnhancedMockWeather();
            }
        } else {
            this.showEnhancedMockWeather();
        }
    }

    async fetchWeatherByCity(city) {
        if (this.useRealAPI) {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                this.displayWeather(data);
            } catch (error) {
                console.error('Weather API error:', error);
                this.showEnhancedMockWeather();
            }
        } else {
            this.showEnhancedMockWeather();
        }
    }

    displayWeather(data) {
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const location = data.name;
        
        const weatherIcon = this.getWeatherIcon(data.weather[0].main);
        const clothingRecommendation = this.getClothingRecommendation(temp, description);
        
        if (this.weatherInfo) {
            this.weatherInfo.innerHTML = `
                ${weatherIcon} ${temp}°C, ${this.capitalizeFirst(description)} in ${location}
                <br><small style="font-size: 0.8em; opacity: 0.8;">${clothingRecommendation}</small>
            `;
        }
    }

    showEnhancedMockWeather() {
        // Enhanced demo weather data with time-based variations
        const currentHour = new Date().getHours();
        const isDay = currentHour >= 6 && currentHour < 18;
        
        const mockWeatherData = [
            { temp: 22, condition: isDay ? 'Sunny' : 'Clear', location: 'New York', recommendation: 'Perfect for light cotton wear' },
            { temp: 18, condition: 'Partly Cloudy', location: 'San Francisco', recommendation: 'Great for layered eco-fabrics' },
            { temp: 28, condition: 'Warm', location: 'Miami', recommendation: 'Ideal for breathable linen' },
            { temp: 15, condition: 'Cool', location: 'Seattle', recommendation: 'Perfect for recycled wool' },
            { temp: 25, condition: 'Sunny', location: 'Los Angeles', recommendation: 'Try organic bamboo fabrics' },
            { temp: 12, condition: 'Overcast', location: 'Portland', recommendation: 'Hemp and wool blends work well' }
        ];
        
        // Add slight temperature variation based on time
        const timeVariation = Math.sin((currentHour / 24) * 2 * Math.PI) * 3;
        const randomWeather = mockWeatherData[Math.floor(Math.random() * mockWeatherData.length)];
        const adjustedTemp = Math.round(randomWeather.temp + timeVariation);
        const weatherIcon = this.getWeatherIconByTemp(adjustedTemp);
        
        if (this.weatherInfo) {
            this.weatherInfo.innerHTML = `
                ${weatherIcon} ${adjustedTemp}°C, ${randomWeather.condition} in ${randomWeather.location}
                <br><small style="font-size: 0.8em; opacity: 0.8;">${randomWeather.recommendation}</small>
            `;
        }
    }

    showMockWeather() {
        // Legacy function - redirect to enhanced version
        this.showEnhancedMockWeather();
    }

    showFallbackWeather() {
        if (this.weatherInfo) {
            this.weatherInfo.innerHTML = `
                🌤️ Weather unavailable
                <br><small style="font-size: 0.8em; opacity: 0.8;">Perfect day for sustainable fashion!</small>
            `;
        }
    }

    getWeatherIcon(condition) {
        const icons = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Fog': '🌫️',
            'Haze': '🌫️'
        };
        return icons[condition] || '🌤️';
    }

    getWeatherIconByTemp(temp) {
        if (temp >= 25) return '☀️';
        if (temp >= 20) return '🌤️';
        if (temp >= 15) return '⛅';
        if (temp >= 10) return '☁️';
        return '🌫️';
    }

    getClothingRecommendation(temp, description) {
        if (temp >= 25) {
            return 'Perfect for organic cotton and bamboo fabrics';
        } else if (temp >= 20) {
            return 'Great for hemp and linen blends';
        } else if (temp >= 15) {
            return 'Ideal for Tencel and modal fabrics';
        } else if (temp >= 10) {
            return 'Perfect for recycled wool and organic cotton layers';
        } else {
            return 'Great for sustainable winter fabrics';
        }
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize weather widget when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new WeatherWidget();
});

// Weather-based fashion recommendations
class FashionWeatherRecommendations {
    static getRecommendationsByWeather(temp, condition) {
        const recommendations = {
            hot: {
                fabrics: ['Organic Cotton', 'Bamboo', 'Linen', 'Hemp'],
                styles: ['T-shirts', 'Tank tops', 'Light dresses', 'Shorts'],
                colors: ['Light colors', 'White', 'Pastels', 'Natural tones'],
                sustainability: 'Choose breathable, natural fibers that require less water to produce'
            },
            warm: {
                fabrics: ['Cotton blends', 'Tencel', 'Modal', 'Organic cotton'],
                styles: ['Casual shirts', 'Light sweaters', 'Midi dresses', 'Chinos'],
                colors: ['Earth tones', 'Soft colors', 'Neutrals'],
                sustainability: 'Opt for fabrics made from sustainable sources with low environmental impact'
            },
            cool: {
                fabrics: ['Recycled wool', 'Organic cotton', 'Hemp blends', 'Eco-fleece'],
                styles: ['Sweaters', 'Hoodies', 'Jeans', 'Layered outfits'],
                colors: ['Warm colors', 'Deep tones', 'Rich earth colors'],
                sustainability: 'Choose recycled and upcycled materials to reduce waste'
            },
            cold: {
                fabrics: ['Recycled wool', 'Organic down', 'Eco-fleece', 'Sustainable synthetics'],
                styles: ['Coats', 'Heavy sweaters', 'Thermal wear', 'Boots'],
                colors: ['Dark colors', 'Rich tones', 'Classic colors'],
                sustainability: 'Invest in durable, high-quality pieces that last for years'
            }
        };

        let category = 'warm';
        if (temp >= 25) category = 'hot';
        else if (temp >= 15) category = 'warm';
        else if (temp >= 5) category = 'cool';
        else category = 'cold';

        return recommendations[category];
    }

    static displayRecommendations(temp, condition, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const recommendations = this.getRecommendationsByWeather(temp, condition);
        
        container.innerHTML = `
            <div class="weather-recommendations">
                <h3>🌤️ Weather-Based Fashion Recommendations</h3>
                <div class="recommendation-grid">
                    <div class="recommendation-item">
                        <h4>🧵 Recommended Fabrics</h4>
                        <ul>
                            ${recommendations.fabrics.map(fabric => `<li>${fabric}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="recommendation-item">
                        <h4>👕 Suggested Styles</h4>
                        <ul>
                            ${recommendations.styles.map(style => `<li>${style}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="recommendation-item">
                        <h4>🎨 Color Palette</h4>
                        <ul>
                            ${recommendations.colors.map(color => `<li>${color}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="sustainability-tip">
                    <h4>🌱 Sustainability Tip</h4>
                    <p>${recommendations.sustainability}</p>
                </div>
            </div>
        `;
    }
}

// API Key Management
class WeatherAPIManager {
    static showApiKeyPrompt() {
        const modal = document.createElement('div');
        modal.className = 'api-key-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🌤️ Weather API Configuration</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>To get real-time weather data, please provide your OpenWeatherMap API key:</p>
                    <div class="form-group">
                        <label for="api-key-input">API Key:</label>
                        <input type="text" id="api-key-input" placeholder="Enter your OpenWeatherMap API key">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="remember-key"> Remember this key
                        </label>
                    </div>
                    <p><small>Get your free API key at <a href="https://openweathermap.org/api" target="_blank">OpenWeatherMap</a></small></p>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" id="use-demo">Use Demo Mode</button>
                    <button class="btn-primary" id="save-api-key">Save & Use Real Weather</button>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .api-key-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                .modal-content {
                    background: white;
                    border-radius: 15px;
                    max-width: 500px;
                    margin: 20px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }
                .modal-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                }
                .modal-body {
                    padding: 20px;
                }
                .modal-body .form-group {
                    margin-bottom: 15px;
                }
                .modal-body label {
                    display: block;
                    margin-bottom: 5px;
                    color: #333;
                    font-weight: 500;
                }
                .modal-body input[type="text"] {
                    width: 100%;
                    padding: 10px;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                }
                .modal-footer {
                    padding: 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }
                .btn-primary, .btn-secondary {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                }
                .btn-primary {
                    background: #27ae60;
                    color: white;
                }
                .btn-secondary {
                    background: #95a5a6;
                    color: white;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.appendChild(modal);

        // Event handlers
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#use-demo').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#save-api-key').addEventListener('click', () => {
            const apiKey = modal.querySelector('#api-key-input').value.trim();
            const remember = modal.querySelector('#remember-key').checked;
            
            if (apiKey) {
                if (remember) {
                    localStorage.setItem('openweather_api_key', apiKey);
                } else {
                    sessionStorage.setItem('openweather_api_key', apiKey);
                }
                
                // Reinitialize weather widget
                new WeatherWidget();
                document.body.removeChild(modal);
                
                // Show success notification
                if (window.EcoFashionAI) {
                    EcoFashionAI.showNotification('Weather API configured successfully!', 'success');
                }
            } else {
                alert('Please enter a valid API key');
            }
        });
    }

    static clearApiKey() {
        localStorage.removeItem('openweather_api_key');
        sessionStorage.removeItem('openweather_api_key');
        new WeatherWidget();
    }
}

// Export for use in other files
window.WeatherWidget = WeatherWidget;
window.FashionWeatherRecommendations = FashionWeatherRecommendations;
window.WeatherAPIManager = WeatherAPIManager;