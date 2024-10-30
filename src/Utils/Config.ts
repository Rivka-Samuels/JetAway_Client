import siteConfig from "./siteConfig";

class Config {
    public vacationsUrl = siteConfig.serverUrl+ "vacations";
    public registerUrl = siteConfig.serverUrl+"register"; 
    public loginUrl = siteConfig.serverUrl+"login";
    public allPaginatedUrl = siteConfig.serverUrl+"vacations-pg"; 

    public getVacationImageUrl(imageFileName: string): string {
        return siteConfig.serverUrl+`images/${imageFileName}`;
    }

    public getPaginatedUrl(page: number, limit: number): string {
        return siteConfig.serverUrl+`vacations-pg?page=${page}&limit=${limit}`;
    }

    public getFollowsUrl(userId?: number, vacationId?: number): string {
        if (userId && vacationId) {
            return siteConfig.serverUrl+`follow/${userId}/${vacationId}`; 
        } else if (userId) {
            return siteConfig.serverUrl+`user-follows/${userId}`; 
        } else if (vacationId) {
            return siteConfig.serverUrl+`vacation-follows/${vacationId}`; 
        }
        return ''; 
    }
}

const appConfig = new Config();
export default appConfig;
