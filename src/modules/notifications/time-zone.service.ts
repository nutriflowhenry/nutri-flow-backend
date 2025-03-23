import { Injectable } from '@nestjs/common';
import * as fs from 'fs';


@Injectable()
export class TimeZoneService {

    private timeZoneMap = new Map<string, any>();

    constructor() {
        this.loadTimeZoneData();
    }

    private loadTimeZoneData() {
        const data = JSON.parse(fs.readFileSync('southamerica-timezones.json', 'utf8'));

        for (const country in data) {
            this.timeZoneMap.set(country, data[country]);
        }
    }


    getTimeZone(country: string, city?: string): string {
        const timeZoneData = this.timeZoneMap.get(country);

        if (typeof timeZoneData === 'string') {
            return timeZoneData;

        } else if (timeZoneData && timeZoneData.exceptions && city) {
            return timeZoneData.exceptions[city] || timeZoneData.default;
        }

        return 'UTC';
    }


}