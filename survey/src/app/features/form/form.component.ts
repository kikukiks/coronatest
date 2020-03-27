import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {ApiService} from '../../core/services/api.service';
import {Router} from '@angular/router';
import {PageService} from 'src/app/core/services/page.service';
import {LocaleService} from 'src/app/core/services/locale.service';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.less'],
})
export class FormComponent implements OnInit, AfterViewInit {
    intent: FormGroup;
    chronic_conditions: FormGroup;
    testing: FormGroup;
    location: FormGroup;
    general: FormGroup;
    exposure: FormGroup;
    symptoms: FormGroup;
    symptomsOptions: FormGroup;

    loading = false;

    public buttonClass;
    public buttonText = 'next';
    public currentStep = {};

    submit = false;

    counties = [
        'harju',
        'tartu',
        'ida_viru',
        'pärnu',
        'lääne_viru',
        'viljandi',
        'rapla',
        'võru',
        'saare',
        'jõgeva',
        'järva',
        'valga',
        'põlva',
        'lääne',
        'hiiu',
    ];

    @ViewChild('stepper', {static: true}) stepper: any;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private router: Router,
        public pageService: PageService,
        public localeService: LocaleService,
    ) {

        this.intent = this.formBuilder.group({
            intent: new FormControl(null, [Validators.required]),
        });

        this.chronic_conditions = this.formBuilder.group({
            chronic_conditions: new FormControl(null, [Validators.required]),
        });

        this.location = this.formBuilder.group({
            shareLocation: new FormControl(null, [Validators.required]),
            longitude: new FormControl(null),
            latitude: new FormControl(null),
            county: new FormControl(null),
        });

        this.general = this.formBuilder.group({
            gender: new FormControl(null, [Validators.required]),
            age: new FormControl(null, [
                Validators.required,
                Validators.min(0),
                Validators.max(200),
                Validators.pattern('^[0-9]*$'),
            ]),
        });

        this.exposure = this.formBuilder.group({
            close_contact: new FormControl(null, [Validators.required]),
        });

        this.symptoms = this.formBuilder.group({
            fever: new FormControl(false),
            cough: new FormControl(false),
            shortness_of_breath: new FormControl(false),
        });

        this.symptomsOptions = this.formBuilder.group({
            fever_temperature: new FormControl(null, [
                Validators.required,
                Validators.min(36),
                Validators.max(42),
            ]),
            symptoms_duration: new FormControl(null, [
                Validators.required,
                Validators.min(1),
                Validators.max(200),
                Validators.pattern('^[0-9]*$'),
            ]),
        });

        this.testing = this.formBuilder.group({
            has_been_tested: new FormControl(null, [Validators.required]),
        });
    }

    ngOnInit() {
        if (!environment.production) {
            this.intent.patchValue({intent: 'family'});
            this.chronic_conditions.patchValue({chronic_conditions: false});
            this.location.patchValue({shareLocation: false});
            this.general.patchValue({gender: 'male', age: 24});
            this.exposure.patchValue({close_contact: 'yes'});
            this.testing.patchValue({has_been_tested: false});
        }
    }

    ngAfterViewInit() {
        this.currentStep = this.stepper._steps._results[0].stepControl;
        this.stepper.selectionChange.subscribe(stepContents => {
            console.log(stepContents);
            if (stepContents.selectedStep.stepControl.controls['has_been_tested']) {
                this.submit = true;
                this.buttonText = 'submit';
            } else {
                this.submit = false;
                this.buttonText = 'next';
            }
            this.currentStep = stepContents.selectedStep.stepControl;
            this.scrollToSectionHook(stepContents.selectedIndex);
        });
        this.scrollToSectionHook(0);
    }

    getLocation(): void {
        this.loading = true;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const longitude = position.coords.longitude;
                const latitude = position.coords.latitude;
                this.location.controls['longitude'].setValue(longitude);
                this.location.controls['latitude'].setValue(latitude);
                this.loading = false;
            }, error => {
                this.loading = false;
            }, {timeout: 5000});
        } else {
            console.log('No support for geolocation');
            this.loading = false;
        }
    }

    private scrollToSectionHook(index) {
        const stepId = this.stepper._getStepLabelId(index);
        const stepElement = document.getElementById(stepId).parentElement;

        document.querySelectorAll('.mat-step').forEach(step => {
            step.classList.remove('active');
        });
        stepElement.classList.add('active');
        const scrollToElementIndex = index === 0 ? 0 : index - 1;
        const scrollToElementId = this.stepper._getStepLabelId(scrollToElementIndex);
        const scrollToElement = document.getElementById(scrollToElementId).parentElement;

        if (stepElement) {
            setTimeout(() => {
                scrollToElement.scrollIntoView({block: 'start', inline: 'nearest', behavior: 'smooth'});
            }, 0);
        }
    }

    getStepButton(stepper: MatStepper) {
        if (this.submit) {
            this.submitForm();
        } else {
            stepper.next();
        }
    }

    submitForm() {
        let fever_temperature = this.symptomsOptions.get('fever_temperature').value || null;
        if (fever_temperature) {
            fever_temperature = fever_temperature.replace(',', '.');
            fever_temperature = +fever_temperature;
        }
        this.loading = true;
        this.apiService
            .sendSurvey({
                ...this.intent.value,
                ...this.chronic_conditions.value,
                ...this.testing.value,
                gender: this.general.get('gender').value,
                age: +this.general.get('age').value,
                ...this.exposure.value,
                county: this.location.controls['county'].value,
                latitude: this.location.get('latitude').value ? '' + this.location.get('latitude').value : null,
                longitude: this.location.get('longitude').value ? '' + this.location.get('longitude').value : null,
                symptoms: this.parseSymptomsToArray(this.symptoms.value),
                fever_temperature,
                symptoms_duration: +this.symptomsOptions.controls['symptoms_duration'].value,
            })
            .then(res => {
                console.log(res);
                this.pageService.submissionResult = res['data'];
                this.loading = false;
                this.router.navigate(['/results']);
            })
            .catch(err => {
                console.log(err);
                this.loading = false;
                alert('Something went wrong');
            });
    }

    parseSymptomsToArray(symptoms: any) {
        return Object.keys(symptoms).filter(key => symptoms[key] === true);
    }
}
