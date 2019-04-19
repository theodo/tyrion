import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import DebtHistory from "../model/debtHistory";
import DateHelper from "../utils/dateHelper";

export default class TemplateRenderer {
    static renderHtmlGraph(debtHistory: DebtHistory, standard: number): void {
        const file = fs.readFileSync(path.resolve(__dirname, '../template/google_charts/report.html'), 'utf-8');

        const debtGraphData = Array<any>();

        for (let debt of debtHistory.debtBag) {
            const debtGraphDataPoint = {
                date : DateHelper.getDateAsHtmlTemplate(debt.commitDateTime),
                debtScore : debt.debtScore,
            };

            debtGraphData.push(debtGraphDataPoint);
        }

        const compiled = _.template(file.toString());
        const htmlGraph = compiled({ 'dataDebt': debtGraphData, 'standard': standard });

        fs.writeFile("tyrion_report.html", htmlGraph, function(err) {
            if(err) {
                return console.log(err);
            }
            console.info("The report was generated!");
        });
    }
}
