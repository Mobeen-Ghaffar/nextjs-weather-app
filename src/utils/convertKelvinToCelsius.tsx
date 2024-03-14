export function convertKelvinToCelsius(tempInKevlin: number): number{
    const tempInCelsius = tempInKevlin - 273.15;
    return Math.floor(tempInCelsius);
}