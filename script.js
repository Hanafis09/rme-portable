// RME Klinik - JavaScript Functions
class RMESystem {
    constructor() {
        this.patients = JSON.parse(localStorage.getItem('rme_patients')) || [];
        this.doctors = JSON.parse(localStorage.getItem('rme_doctors')) || [];
        this.appointments = JSON.parse(localStorage.getItem('rme_appointments')) || [];
        this.medicalRecords = JSON.parse(localStorage.getItem('rme_medical_records')) || [];
        this.nextPatientId = parseInt(localStorage.getItem('rme_next_patient_id')) || 1;
        this.nextAppointmentId = parseInt(localStorage.getItem('rme_next_appointment_id')) || 1;
        this.nextMedicalRecordId = parseInt(localStorage.getItem('rme_next_medical_record_id')) || 1;
        
        this.init();
    }

    init() {
        // Initialize with sample data if empty
        if (this.doctors.length === 0) {
            this.initSampleData();
        }
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('appointment-date-filter').value = today;
        
        // Initialize dashboard
        this.updateDashboard();
        this.loadTodaySchedule();
        
        // Load data tables
        this.loadPatientsTable();
        this.loadAppointmentsTable();
        this.loadDoctorsTable();
        
        // Load select options
        this.loadPatientOptions();
        this.loadDoctorOptions();
    }

    initSampleData() {
        // Sample doctors
        this.doctors = [
            {
                id: 1,
                name: 'Dr. Ahmad Santoso, Sp.PD',
                specialty: 'Penyakit Dalam',
                sip: 'SIP.123.456.789',
                phone: '081234567890',
                status: 'active'
            },
            {
                id: 2,
                name: 'Dr. Siti Nurhaliza, Sp.A',
                specialty: 'Anak',
                sip: 'SIP.987.654.321',
                phone: '081987654321',
                status: 'active'
            },
            {
                id: 3,
                name: 'Dr. Budi Prasetyo, Sp.OG',
                specialty: 'Obstetri & Ginekologi',
                sip: 'SIP.456.789.123',
                phone: '081456789123',
                status: 'active'
            }
        ];

        // Sample patients
        this.patients = [
            {
                id: 1,
                rm: 'RM001',
                nik: '3201012345678901',
                name: 'Andi Setiawan',
                gender: 'L',
                birthdate: '1985-05-15',
                phone: '081234567890',
                address: 'Jl. Merdeka No. 123, Jakarta'
            },
            {
                id: 2,
                rm: 'RM002',
                nik: '3201012345678902',
                name: 'Sari Dewi',
                gender: 'P',
                birthdate: '1990-08-20',
                phone: '081987654321',
                address: 'Jl. Sudirman No. 456, Jakarta'
            }
        ];

        this.nextPatientId = 3;
        this.saveData();
    }

    saveData() {
        localStorage.setItem('rme_patients', JSON.stringify(this.patients));
        localStorage.setItem('rme_doctors', JSON.stringify(this.doctors));
        localStorage.setItem('rme_appointments', JSON.stringify(this.appointments));
        localStorage.setItem('rme_medical_records', JSON.stringify(this.medicalRecords));
        localStorage.setItem('rme_next_patient_id', this.nextPatientId.toString());
        localStorage.setItem('rme_next_appointment_id', this.nextAppointmentId.toString());
        localStorage.setItem('rme_next_medical_record_id', this.nextMedicalRecordId.toString());
    }

    generateRM() {
        return 'RM' + String(this.nextPatientId).padStart(3, '0');
    }

    updateDashboard() {
        document.getElementById('total-patients').textContent = this.patients.length;
        document.getElementById('total-doctors').textContent = this.doctors.filter(d => d.status === 'active').length;
        
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = this.appointments.filter(a => a.date === today);
        document.getElementById('today-appointments').textContent = todayAppointments.length;
        
        const pendingAppointments = this.appointments.filter(a => a.status === 'waiting');
        document.getElementById('pending-appointments').textContent = pendingAppointments.length;
    }

    loadTodaySchedule() {
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = this.appointments.filter(a => a.date === today);
        const tbody = document.getElementById('today-schedule-body');
        
        if (todayAppointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Tidak ada jadwal hari ini</td></tr>';
            return;
        }

        tbody.innerHTML = todayAppointments.map(appointment => {
            const patient = this.patients.find(p => p.id === appointment.patientId);
            const doctor = this.doctors.find(d => d.id === appointment.doctorId);
            const statusClass = this.getStatusClass(appointment.status);
            
            return `
                <tr>
                    <td>${appointment.time}</td>
                    <td>${patient ? patient.name : 'Unknown'}</td>
                    <td>${doctor ? doctor.name : 'Unknown'}</td>
                    <td><span class="badge ${statusClass}">${this.getStatusText(appointment.status)}</span></td>
                </tr>
            `;
        }).join('');
    }

    loadPatientsTable() {
        const tbody = document.getElementById('patients-table-body');
        
        if (this.patients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Belum ada data pasien</td></tr>';
            return;
        }

        tbody.innerHTML = this.patients.map(patient => `
            <tr>
                <td>${patient.rm}</td>
                <td>${patient.name}</td>
                <td>${this.formatDate(patient.birthdate)}</td>
                <td>${patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                <td>${patient.phone}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="rme.editPatient(${patient.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="rme.showMedicalRecord(${patient.id})">
                        <i class="fas fa-file-medical"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rme.deletePatient(${patient.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadAppointmentsTable() {
        const tbody = document.getElementById('appointments-table-body');
        
        if (this.appointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Belum ada jadwal</td></tr>';
            return;
        }

        tbody.innerHTML = this.appointments.map(appointment => {
            const patient = this.patients.find(p => p.id === appointment.patientId);
            const doctor = this.doctors.find(d => d.id === appointment.doctorId);
            const statusClass = this.getStatusClass(appointment.status);
            
            return `
                <tr>
                    <td>${this.formatDate(appointment.date)}</td>
                    <td>${appointment.time}</td>
                    <td>${patient ? patient.name : 'Unknown'}</td>
                    <td>${doctor ? doctor.name : 'Unknown'}</td>
                    <td><span class="badge ${statusClass}">${this.getStatusText(appointment.status)}</span></td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="rme.updateAppointmentStatus(${appointment.id}, 'completed')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="rme.deleteAppointment(${appointment.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadDoctorsTable() {
        const tbody = document.getElementById('doctors-table-body');
        
        if (this.doctors.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Belum ada data dokter</td></tr>';
            return;
        }

        tbody.innerHTML = this.doctors.map(doctor => {
            const statusClass = doctor.status === 'active' ? 'status-active' : 'status-inactive';
            
            return `
                <tr>
                    <td>${doctor.name}</td>
                    <td>${doctor.specialty}</td>
                    <td>${doctor.sip}</td>
                    <td>${doctor.phone}</td>
                    <td><span class="badge ${statusClass}">${doctor.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="rme.editDoctor(${doctor.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="rme.deleteDoctor(${doctor.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadPatientOptions() {
        const select = document.getElementById('appointment-patient');
        select.innerHTML = '<option value="">Pilih Pasien</option>' +
            this.patients.map(patient => `<option value="${patient.id}">${patient.name} (${patient.rm})</option>`).join('');
    }

    loadDoctorOptions() {
        const selects = ['appointment-doctor', 'mr-doctor'];
        const options = '<option value="">Pilih Dokter</option>' +
            this.doctors.filter(d => d.status === 'active')
                .map(doctor => `<option value="${doctor.id}">${doctor.name}</option>`).join('');
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) select.innerHTML = options;
        });
    }

    getStatusClass(status) {
        const statusClasses = {
            waiting: 'status-waiting',
            'in-progress': 'status-in-progress',
            completed: 'status-completed',
            cancelled: 'status-cancelled'
        };
        return statusClasses[status] || 'bg-secondary';
    }

    getStatusText(status) {
        const statusTexts = {
            waiting: 'Menunggu',
            'in-progress': 'Sedang Diperiksa',
            completed: 'Selesai',
            cancelled: 'Dibatalkan'
        };
        return statusTexts[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID');
    }

    // Patient Management
    showPatientModal(id = null) {
        const modal = new bootstrap.Modal(document.getElementById('patientModal'));
        const form = document.getElementById('patient-form');
        
        if (id) {
            const patient = this.patients.find(p => p.id === id);
            if (patient) {
                document.getElementById('patient-modal-title').textContent = 'Edit Pasien';
                document.getElementById('patient-id').value = patient.id;
                document.getElementById('patient-rm').value = patient.rm;
                document.getElementById('patient-nik').value = patient.nik;
                document.getElementById('patient-name').value = patient.name;
                document.getElementById('patient-gender').value = patient.gender;
                document.getElementById('patient-birthdate').value = patient.birthdate;
                document.getElementById('patient-phone').value = patient.phone;
                document.getElementById('patient-address').value = patient.address;
            }
        } else {
            document.getElementById('patient-modal-title').textContent = 'Tambah Pasien';
            form.reset();
            document.getElementById('patient-rm').value = this.generateRM();
        }
        
        modal.show();
    }

    savePatient() {
        const form = document.getElementById('patient-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const id = document.getElementById('patient-id').value;
        const patientData = {
            rm: document.getElementById('patient-rm').value,
            nik: document.getElementById('patient-nik').value,
            name: document.getElementById('patient-name').value,
            gender: document.getElementById('patient-gender').value,
            birthdate: document.getElementById('patient-birthdate').value,
            phone: document.getElementById('patient-phone').value,
            address: document.getElementById('patient-address').value
        };

        if (id) {
            // Edit existing patient
            const index = this.patients.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                this.patients[index] = { ...this.patients[index], ...patientData };
            }
        } else {
            // Add new patient
            patientData.id = this.nextPatientId++;
            this.patients.push(patientData);
        }

        this.saveData();
        this.loadPatientsTable();
        this.loadPatientOptions();
        this.updateDashboard();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('patientModal'));
        modal.hide();
    }

    editPatient(id) {
        this.showPatientModal(id);
    }

    deletePatient(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data pasien ini?')) {
            this.patients = this.patients.filter(p => p.id !== id);
            this.saveData();
            this.loadPatientsTable();
            this.loadPatientOptions();
            this.updateDashboard();
        }
    }

    searchPatients() {
        const searchTerm = document.getElementById('patient-search').value.toLowerCase();
        const filteredPatients = this.patients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm) ||
            patient.rm.toLowerCase().includes(searchTerm) ||
            patient.nik.includes(searchTerm)
        );
        
        this.displayFilteredPatients(filteredPatients);
    }

    displayFilteredPatients(patients) {
        const tbody = document.getElementById('patients-table-body');
        
        if (patients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Tidak ada data yang sesuai</td></tr>';
            return;
        }

        tbody.innerHTML = patients.map(patient => `
            <tr>
                <td>${patient.rm}</td>
                <td>${patient.name}</td>
                <td>${this.formatDate(patient.birthdate)}</td>
                <td>${patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                <td>${patient.phone}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="rme.editPatient(${patient.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="rme.showMedicalRecord(${patient.id})">
                        <i class="fas fa-file-medical"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rme.deletePatient(${patient.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Appointment Management
    showAppointmentModal(id = null) {
        const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
        const form = document.getElementById('appointment-form');
        
        if (id) {
            const appointment = this.appointments.find(a => a.id === id);
            if (appointment) {
                document.getElementById('appointment-id').value = appointment.id;
                document.getElementById('appointment-patient').value = appointment.patientId;
                document.getElementById('appointment-doctor').value = appointment.doctorId;
                document.getElementById('appointment-date').value = appointment.date;
                document.getElementById('appointment-time').value = appointment.time;
                document.getElementById('appointment-complaint').value = appointment.complaint || '';
            }
        } else {
            form.reset();
            // Set default date to today
            document.getElementById('appointment-date').value = new Date().toISOString().split('T')[0];
        }
        
        modal.show();
    }

    saveAppointment() {
        const form = document.getElementById('appointment-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const id = document.getElementById('appointment-id').value;
        const appointmentData = {
            patientId: parseInt(document.getElementById('appointment-patient').value),
            doctorId: parseInt(document.getElementById('appointment-doctor').value),
            date: document.getElementById('appointment-date').value,
            time: document.getElementById('appointment-time').value,
            complaint: document.getElementById('appointment-complaint').value,
            status: 'waiting'
        };

        if (id) {
            // Edit existing appointment
            const index = this.appointments.findIndex(a => a.id === parseInt(id));
            if (index !== -1) {
                this.appointments[index] = { ...this.appointments[index], ...appointmentData };
            }
        } else {
            // Add new appointment
            appointmentData.id = this.nextAppointmentId++;
            this.appointments.push(appointmentData);
        }

        this.saveData();
        this.loadAppointmentsTable();
        this.loadTodaySchedule();
        this.updateDashboard();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
        modal.hide();
    }

    updateAppointmentStatus(id, status) {
        const appointment = this.appointments.find(a => a.id === id);
        if (appointment) {
            appointment.status = status;
            this.saveData();
            this.loadAppointmentsTable();
            this.loadTodaySchedule();
            this.updateDashboard();
        }
    }

    deleteAppointment(id) {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            this.appointments = this.appointments.filter(a => a.id !== id);
            this.saveData();
            this.loadAppointmentsTable();
            this.loadTodaySchedule();
            this.updateDashboard();
        }
    }

    filterAppointments() {
        const selectedDate = document.getElementById('appointment-date-filter').value;
        const filteredAppointments = selectedDate ? 
            this.appointments.filter(a => a.date === selectedDate) : 
            this.appointments;
        
        this.displayFilteredAppointments(filteredAppointments);
    }

    displayFilteredAppointments(appointments) {
        const tbody = document.getElementById('appointments-table-body');
        
        if (appointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Tidak ada jadwal pada tanggal tersebut</td></tr>';
            return;
        }

        tbody.innerHTML = appointments.map(appointment => {
            const patient = this.patients.find(p => p.id === appointment.patientId);
            const doctor = this.doctors.find(d => d.id === appointment.doctorId);
            const statusClass = this.getStatusClass(appointment.status);
            
            return `
                <tr>
                    <td>${this.formatDate(appointment.date)}</td>
                    <td>${appointment.time}</td>
                    <td>${patient ? patient.name : 'Unknown'}</td>
                    <td>${doctor ? doctor.name : 'Unknown'}</td>
                    <td><span class="badge ${statusClass}">${this.getStatusText(appointment.status)}</span></td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="rme.updateAppointmentStatus(${appointment.id}, 'completed')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="rme.deleteAppointment(${appointment.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Doctor Management
    showDoctorModal(id = null) {
        const modal = new bootstrap.Modal(document.getElementById('doctorModal'));
        const form = document.getElementById('doctor-form');
        
        if (id) {
            const doctor = this.doctors.find(d => d.id === id);
            if (doctor) {
                document.getElementById('doctor-id').value = doctor.id;
                document.getElementById('doctor-name').value = doctor.name;
                document.getElementById('doctor-specialty').value = doctor.specialty;
                document.getElementById('doctor-sip').value = doctor.sip;
                document.getElementById('doctor-phone').value = doctor.phone;
                document.getElementById('doctor-status').value = doctor.status;
            }
        } else {
            form.reset();
            document.getElementById('doctor-status').value = 'active';
        }
        
        modal.show();
    }

    saveDoctor() {
        const form = document.getElementById('doctor-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const id = document.getElementById('doctor-id').value;
        const doctorData = {
            name: document.getElementById('doctor-name').value,
            specialty: document.getElementById('doctor-specialty').value,
            sip: document.getElementById('doctor-sip').value,
            phone: document.getElementById('doctor-phone').value,
            status: document.getElementById('doctor-status').value
        };

        if (id) {
            // Edit existing doctor
            const index = this.doctors.findIndex(d => d.id === parseInt(id));
            if (index !== -1) {
                this.doctors[index] = { ...this.doctors[index], ...doctorData };
            }
        } else {
            // Add new doctor
            doctorData.id = Math.max(...this.doctors.map(d => d.id), 0) + 1;
            this.doctors.push(doctorData);
        }

        this.saveData();
        this.loadDoctorsTable();
        this.loadDoctorOptions();
        this.updateDashboard();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('doctorModal'));
        modal.hide();
    }

    editDoctor(id) {
        this.showDoctorModal(id);
    }

    deleteDoctor(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data dokter ini?')) {
            this.doctors = this.doctors.filter(d => d.id !== id);
            this.saveData();
            this.loadDoctorsTable();
            this.loadDoctorOptions();
            this.updateDashboard();
        }
    }

    // Medical Records
    showMedicalRecord(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (!patient) return;

        document.getElementById('mr-patient-name').textContent = patient.name;
        document.getElementById('mr-patient-id').value = patientId;
        
        // Set current datetime
        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 16);
        document.getElementById('mr-date').value = formattedDateTime;
        
        this.loadMedicalHistory(patientId);
        
        const modal = new bootstrap.Modal(document.getElementById('medicalRecordModal'));
        modal.show();
    }

    loadMedicalHistory(patientId) {
        const records = this.medicalRecords.filter(r => r.patientId === patientId);
        const historyDiv = document.getElementById('medical-history');
        
        if (records.length === 0) {
            historyDiv.innerHTML = '<p class="text-muted text-center">Belum ada riwayat pemeriksaan</p>';
            return;
        }

        historyDiv.innerHTML = records.map(record => {
            const doctor = this.doctors.find(d => d.id === record.doctorId);
            const date = new Date(record.date);
            
            return `
                <div class="medical-record-item">
                    <div class="record-header">
                        <div class="record-date">${date.toLocaleDateString('id-ID')} ${date.toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</div>
                        <div class="record-doctor">Dokter: ${doctor ? doctor.name : 'Unknown'}</div>
                    </div>
                    <div class="record-content">
                        <div class="record-label">Keluhan Utama:</div>
                        <div>${record.complaint}</div>
                        <div class="record-label">Pemeriksaan Fisik:</div>
                        <div>${record.examination || '-'}</div>
                        <div class="record-label">Diagnosis:</div>
                        <div>${record.diagnosis}</div>
                        <div class="record-label">Terapi/Obat:</div>
                        <div>${record.therapy || '-'}</div>
                        ${record.notes ? `<div class="record-label">Catatan:</div><div>${record.notes}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    saveMedicalRecord() {
        const form = document.getElementById('medical-record-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const recordData = {
            id: this.nextMedicalRecordId++,
            patientId: parseInt(document.getElementById('mr-patient-id').value),
            doctorId: parseInt(document.getElementById('mr-doctor').value),
            date: document.getElementById('mr-date').value,
            complaint: document.getElementById('mr-complaint').value,
            examination: document.getElementById('mr-examination').value,
            diagnosis: document.getElementById('mr-diagnosis').value,
            therapy: document.getElementById('mr-therapy').value,
            notes: document.getElementById('mr-notes').value
        };

        this.medicalRecords.push(recordData);
        this.saveData();
        
        // Refresh medical history
        this.loadMedicalHistory(recordData.patientId);
        
        // Clear form
        form.reset();
        
        // Set current datetime again
        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 16);
        document.getElementById('mr-date').value = formattedDateTime;
        
        // Switch to history tab
        const historyTab = document.querySelector('[data-bs-toggle="tab"][href="#history"]');
        const tab = new bootstrap.Tab(historyTab);
        tab.show();
    }

    // Reports
    generateReport() {
        const fromDate = document.getElementById('report-from-date').value;
        const toDate = document.getElementById('report-to-date').value;
        const reportType = document.getElementById('report-type').value;
        
        if (!fromDate || !toDate) {
            alert('Harap pilih rentang tanggal');
            return;
        }

        let reportData = [];
        let reportHtml = '';

        switch (reportType) {
            case 'visits':
                reportData = this.appointments.filter(a => 
                    a.date >= fromDate && a.date <= toDate && a.status === 'completed'
                );
                reportHtml = this.generateVisitsReport(reportData);
                break;
            case 'patients':
                // Assuming we track registration date (for now, using first appointment)
                reportData = this.patients.filter(p => {
                    const firstAppointment = this.appointments.find(a => a.patientId === p.id);
                    return firstAppointment && firstAppointment.date >= fromDate && firstAppointment.date <= toDate;
                });
                reportHtml = this.generatePatientsReport(reportData);
                break;
            case 'doctors':
                reportData = this.appointments.filter(a => 
                    a.date >= fromDate && a.date <= toDate && a.status === 'completed'
                );
                reportHtml = this.generateDoctorsReport(reportData);
                break;
        }

        document.getElementById('report-results').innerHTML = reportHtml;
    }

    generateVisitsReport(visits) {
        if (visits.length === 0) {
            return '<p class="text-muted text-center">Tidak ada data kunjungan pada periode tersebut</p>';
        }

        const total = visits.length;
        const byDoctor = {};
        
        visits.forEach(visit => {
            const doctor = this.doctors.find(d => d.id === visit.doctorId);
            const doctorName = doctor ? doctor.name : 'Unknown';
            byDoctor[doctorName] = (byDoctor[doctorName] || 0) + 1;
        });

        return `
            <div class="row">
                <div class="col-md-6">
                    <h6>Total Kunjungan: ${total}</h6>
                    <h6>Kunjungan per Dokter:</h6>
                    <ul class="list-group">
                        ${Object.entries(byDoctor).map(([doctor, count]) => 
                            `<li class="list-group-item d-flex justify-content-between align-items-center">
                                ${doctor}
                                <span class="badge bg-primary rounded-pill">${count}</span>
                            </li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    generatePatientsReport(patients) {
        if (patients.length === 0) {
            return '<p class="text-muted text-center">Tidak ada pasien baru pada periode tersebut</p>';
        }

        return `
            <h6>Total Pasien Baru: ${patients.length}</h6>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>No. RM</th>
                            <th>Nama</th>
                            <th>Jenis Kelamin</th>
                            <th>Tanggal Lahir</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patients.map(patient => `
                            <tr>
                                <td>${patient.rm}</td>
                                <td>${patient.name}</td>
                                <td>${patient.gender === 'L' ? 'L' : 'P'}</td>
                                <td>${this.formatDate(patient.birthdate)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateDoctorsReport(appointments) {
        if (appointments.length === 0) {
            return '<p class="text-muted text-center">Tidak ada data aktivitas dokter pada periode tersebut</p>';
        }

        const doctorStats = {};
        
        appointments.forEach(appointment => {
            const doctor = this.doctors.find(d => d.id === appointment.doctorId);
            const doctorName = doctor ? doctor.name : 'Unknown';
            
            if (!doctorStats[doctorName]) {
                doctorStats[doctorName] = {
                    visits: 0,
                    patients: new Set()
                };
            }
            
            doctorStats[doctorName].visits++;
            doctorStats[doctorName].patients.add(appointment.patientId);
        });

        return `
            <h6>Aktivitas Dokter</h6>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Dokter</th>
                            <th>Total Kunjungan</th>
                            <th>Pasien Unik</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(doctorStats).map(([doctor, stats]) => `
                            <tr>
                                <td>${doctor}</td>
                                <td>${stats.visits}</td>
                                <td>${stats.patients.size}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId + '-page').classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Global functions for modal triggers
function showPatientModal(id = null) {
    rme.showPatientModal(id);
}

function showAppointmentModal(id = null) {
    rme.showAppointmentModal(id);
}

function showDoctorModal(id = null) {
    rme.showDoctorModal(id);
}

function savePatient() {
    rme.savePatient();
}

function saveAppointment() {
    rme.saveAppointment();
}

function saveDoctor() {
    rme.saveDoctor();
}

function saveMedicalRecord() {
    rme.saveMedicalRecord();
}

function searchPatients() {
    rme.searchPatients();
}

function filterAppointments() {
    rme.filterAppointments();
}

function generateReport() {
    rme.generateReport();
}

// Initialize RME System
const rme = new RMESystem();

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    document.getElementById('report-from-date').value = firstDayOfMonth;
    document.getElementById('report-to-date').value = today;
    
    // Search on Enter key
    document.getElementById('patient-search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchPatients();
        }
    });
});
