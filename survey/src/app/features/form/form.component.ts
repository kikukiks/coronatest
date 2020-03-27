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
    symptomsPeriod: FormGroup;
    feverOptions: FormGroup;

    loading = false;

    public buttonDisabled = false;
    public buttonMethod;
    public buttonClass;
    public buttonText = 'next';
    public currentStep = {};
    private formListener;


    hasFever = false;

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

        this.feverOptions = this.formBuilder.group({
            fever_temperature: new FormControl(null, [
                Validators.required,
                Validators.min(36),
                Validators.max(42),
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
            this.currentStep = stepContents.selectedStep.stepControl;
            this.scrollToSectionHook(stepContents.selectedIndex);
            // stepContents.selectedStep.stepControl.valueChanges.subscribe(res => {
            //     console.log(res);
            // });
        });
        this.scrollToSectionHook(0);
        // this.symptoms.valueChanges.subscribe(e => {
        //     this.hasFever = !!this.symptoms.get('fever').value;
        //     // this.handleButtonUI(3);
        // });
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
        // this.handleButtonUI(index);
    }

    // handleButtonUI(currentStepIndex) {
    //     console.log(currentStepIndex);
    //     const items = this.getStepItems(currentStepIndex);
    //     if (items) {
    //         this.buttonText = items.text;
    //         this.buttonClass = items.class;
    //         this.buttonMethod = items.method;
    //         this.buttonDisabled = !items.form.valid || this.loading;
    //
    //         if (this.formListener) {
    //             this.formListener.unsubscribe();
    //         }
    //         this.formListener = items.form.statusChanges.subscribe(status => {
    //             this.buttonDisabled = status !== 'VALID';
    //         });
    //     }
    // }

    getStepItems(currentStepIndex) {
        switch (currentStepIndex) {
            case 0:
                return {
                    form: this.intent,
                    method: this.nextStep,
                    class: '',
                    text: 'next',
                };
            case 1:
                return {
                    form: this.general,
                    method: this.nextStep,
                    class: '',
                    text: 'next',
                };
            case 2:
                return {
                    form: this.chronic_conditions,
                    method: this.nextStep,
                    class: '',
                    text: 'next',
                };
            case 3:
                return {
                    form: this.symptoms,
                    method: this.nextStep,
                    class: '',
                    text: 'next',
                };
            case 4:
                if (!this.hasFever) {
                    return {
                        form: this.exposure,
                        method: this.nextStep,
                        class: '',
                        text: 'next',
                    };
                } else {
                    return {
                        form: this.feverOptions,
                        method: this.nextStep,
                        class: '',
                        text: 'next',
                    };
                }
            case 5:
                if (!this.hasFever) {
                    return {
                        form: this.location,
                        method: this.nextStep,
                        class: '',
                        text: 'next',
                    };
                } else {
                    return {
                        form: this.exposure,
                        method: this.nextStep,
                        class: '',
                        text: 'next',
                    };
                }
            case 6:
                if (!this.hasFever) {
                    return {
                        form: this.testing,
                        method: this.submitForm,
                        class: 'submit-btn',
                        text: 'submit',
                    };
                }
                return {
                    form: this.location,
                    method: this.nextStep,
                    class: '',
                    text: 'next',
                };
            case 7:
                return {
                    form: this.testing,
                    method: this.submitForm,
                    class: 'submit-btn',
                    text: 'submit',
                };
            default:
                return null;
        }
    }

    nextStep(stepper: MatStepper) {
        stepper.next();
    }

    submitForm(stepper: MatStepper) {
        let fever_temperature = this.feverOptions.get('fever_temperature').value || null;
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
                latitude: this.location.get('latitude').value ? '' + this.location.get('latitude').value : null,
                longitude: this.location.get('longitude').value ? '' + this.location.get('longitude').value : null,
                symptoms: this.parseSymptomsToArray(this.symptoms.value),
                fever_temperature,
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
