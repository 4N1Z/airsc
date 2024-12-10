type WeatherProps = {
  temperature?: number;
  weather?: string;
  location?: string;
};

export const Weather = ({ 
  temperature = 22, 
  weather = "Sunny", 
  location = "Sample City" 
}: WeatherProps) => {
  return (
    <div className="text-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">{location}</h2>
          <p className="text-sm text-gray-300">{weather}</p>
        </div>
        <div className="text-2xl font-semibold">
          {temperature}°C
        </div>
      </div>
      
      {/* Visual indicator for weather */}
      <div className="mt-2 text-2xl">
        {weather.toLowerCase().includes('sun') && '☀️'}
        {weather.toLowerCase().includes('cloud') && '☁️'}
        {weather.toLowerCase().includes('rain') && '🌧️'}
        {weather.toLowerCase().includes('snow') && '❄️'}
        {weather.toLowerCase().includes('thunder') && '⛈️'}
      </div>
    </div>
  );
};