import { Component, OnInit } from "@angular/core";
import { PageService } from "src/app/core/services/page.service";
import { LocaleService } from "src/app/core/services/locale.service";

@Component({
    selector: "app-results",
    templateUrl: "./results.component.html",
    styleUrls: ["./results.component.less"]
})
export class ResultsComponent implements OnInit {
    texts = null;
    probabilityTexts = {
        SEVERE: "high_risk_severe_symptoms_message",
        LOW: "low_risk_message",
        MEDIUM: "medium_risk_message",
        HIGH: "high_risk_message"
    };
    scenarioTexts = {
        SCENARIO_1: [
            "healthy_person_does_not_need_quarantine",
            "retake_test_when_sick",
            "risk_group_contact_doctor_when_symptoms",
            "only_call_112_in_an_emergecny",
            "precautionary_measures_recommended"
        ],
        SCENARIO_2: [
            "quarantine_2_weeks",
            "check_your_health",
            "retake_test_when_sick",
            "only_call_112_in_an_emergecny"
        ],
        SCENARIO_3: [
            "home_care_2_weeks",
            "monitor_health_detailed",
            "risk_group_contact_doctor",
            "only_call_112_in_an_emergecny",
            "exposed_persons_stay_home"
        ],
        SCENARIO_4: [
            "home_care_2_weeks",
            "call_your_general_practicioner",
            "check_your_health",
            "only_call_112_in_an_emergecny",
            "exposed_persons_stay_home"
        ],
        SCENARIO_5: [
            "wear_a_mask",
            "call_ambulance",
            "isolate_until_ambulance_arrives",
            "exposed_persons_stay_home"
        ],
        SCENARIO_6: [
            "home_care_monitor",
            "monitor_health_detailed",
            "risk_group_contact_doctor",
            "only_call_112_in_an_emergecny",
            "close_people_no_quarantine"
        ],
        SCENARIO_7: [
            "home_care_2_weeks",
            "call_your_general_practicioner",
            "check_your_health",
            "only_call_112_in_an_emergecny",
            "close_people_no_quarantine"
        ]
    };

    constructor(
        private pageService: PageService,
        public localeService: LocaleService
    ) {}

    ngOnInit() {
        if (this.pageService.submissionResult) {
            console.log(this.pageService.submissionResult);
            this.texts = {
                message: this.probabilityTexts[
                    this.pageService.submissionResult.probability
                ],
                risk_message: this.pageService.submissionResult.risk_message,
                act_message: this.pageService.submissionResult.act_message,
                instructions: this.scenarioTexts[
                    this.pageService.submissionResult.scenario
                ]
            };
        }
    }
}
