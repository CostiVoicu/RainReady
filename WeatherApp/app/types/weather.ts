interface WeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    weather: [
        {
            id: number;
            main: string; // "Clouds", "Rain", etc.
            description: string; // "overcast clouds", "moderate rain", etc.
            icon: string; // Icon code (e.g., "01d", "10n")
        }
    ];
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
    };
    clouds: {
        all: number;
    };
    dt: number; // Time of data forecast, unix, UTC
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export type { WeatherData };
