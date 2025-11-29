import React, { useState, useEffect } from 'react';
import { reservationsAPI } from '../services/api';

function ReservationsPage({ isArabic, reservations, setReservations, onRefreshReservations }) {
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [hideVat, setHideVat] = useState(true);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, reservation: null });
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({
    chooseType: '',
    relatedAccount: '',
    salesOfficer: '',
    currency: 'EGP',
    followUp: '',
    branch: '',
    dateOfInvoice: '2025-10-27',
    invoiceNo: '',
    tag2: '',
    destination: '',
    notesOfInvoice: '',
    progress: 'Pending',
    confirmStatus: 'UnConfirmed'
  });
  const [searchFilters, setSearchFilters] = useState({
    fileNumber: '',
    client: '',
    phone: '',
    branch: '',
    dateFrom: '',
    dateTo: ''
  });

  // Translations
  const t = isArabic ? {
    reservations: 'الحجوزات',
    add: 'إضافة',
    search: 'بحث',
    fileNumber: 'رقم الملف',
    client: 'العميل',
    phone: 'الهاتف',
    date: 'التاريخ',
    followUp: 'المتابعة',
    amount: 'المبلغ',
    user: 'المستخدم',
    branch: 'الفرع',
    salesOfficer: 'مسؤول المبيعات',
    progress: 'التقدم',
    confirmStatus: 'حالة التأكيد',
    dateOfInvoice: 'تاريخ الفاتورة',
    invoiceNo: 'رقم الفاتورة',
    manualInvoiceSerial: 'الرقم التسلسلي اليدوي',
    manualInvoiceID: 'معرف الفاتورة اليدوية',
    manualInvoiceDate: 'تاريخ الفاتورة اليدوية',
    updatedBy: 'تم التحديث بواسطة',
    downloadPDF: 'تنزيل PDF',
    downloadExcel: 'تنزيل Excel',
    import: 'استيراد',
    example: 'مثال',
    result: 'النتيجة',
    of: 'من',
    total: 'الإجمالي',
    noData: 'لا توجد بيانات',
    addReservation: 'إضافة حجز',
    chooseType: 'اختر النوع',
    selectLedger: 'اختر دفتر الأستاذ',
    relatedAccount: 'الحساب المرتبط',
    currency: 'العملة',
    selectStatus: 'اختر الحالة',
    tag2: 'العلامة 2',
    destination: 'الوجهة',
    hideVat: 'إخفاء ضريبة القيمة المضافة',
    notesOfInvoice: 'ملاحظات الفاتورة',
    close: 'إغلاق',
    clear: 'مسح',
    updatedAt: 'تم التحديث في',
    selectAll: 'تحديد الكل',
    actions: 'الإجراءات',
    edit: 'تعديل',
    delete: 'حذف',
    searchReservations: 'البحث في الحجوزات',
    dateFrom: 'من تاريخ',
    dateTo: 'إلى تاريخ',
    confirmDelete: 'هل أنت متأكد من حذف هذا الحجز؟',
    confirmDeleteSelected: 'هل أنت متأكد من حذف {count} حجز محدد؟',
    addedSuccessfully: 'تم إضافة الحجز بنجاح!',
    deletedSuccessfully: 'تم حذف الحجز بنجاح!',
    selectedDeleted: 'تم حذف {count} حجز بنجاح!',
    deleteSelected: 'حذف المحدد',
    selected: 'محدد',
    copyFileNumber: 'نسخ رقم الملف',
    duplicate: 'تكرار',
    convertToInvoice: 'تحويل إلى فاتورة',
    fileNumberCopied: 'تم نسخ رقم الملف!',
    duplicatedSuccessfully: 'تم تكرار الحجز بنجاح!',
    convertedToInvoice: 'تم التحويل إلى فاتورة بنجاح!'
  } : {
    reservations: 'Reservations',
    add: 'Add',
    search: 'Search',
    fileNumber: 'File Number',
    client: 'Client',
    phone: 'Phone',
    date: 'Date',
    followUp: 'Follow up',
    amount: 'Amount',
    user: 'User',
    branch: 'Branch',
    salesOfficer: 'Sales Officer',
    progress: 'Progress',
    confirmStatus: 'Confirm Status',
    dateOfInvoice: 'Date of invoice',
    invoiceNo: 'Invoice No.',
    manualInvoiceSerial: 'Manual Invoice Serial',
    manualInvoiceID: 'Manual Invoice ID',
    manualInvoiceDate: 'Manual Invoice Date',
    updatedBy: 'Updated By',
    downloadPDF: 'Download PDF',
    downloadExcel: 'Download Excel',
    import: 'Import',
    example: 'Example',
    result: 'Result',
    of: 'of',
    total: 'Total',
    noData: 'No data available',
    addReservation: 'Add Reservation',
    chooseType: 'Choose Type',
    selectLedger: 'Select Ledger',
    relatedAccount: 'Related Account',
    currency: 'Currency',
    selectStatus: 'Select Status',
    tag2: 'Tag 2',
    destination: 'Destination',
    hideVat: 'Hide Vat',
    notesOfInvoice: 'Notes of invoice',
    close: 'Close',
    clear: 'Clear',
    updatedAt: 'Updated At',
    selectAll: 'Select All',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    searchReservations: 'Search Reservations',
    dateFrom: 'Date From',
    dateTo: 'Date To',
    confirmDelete: 'Are you sure you want to delete this reservation?',
    confirmDeleteSelected: 'Are you sure you want to delete {count} selected reservations?',
    addedSuccessfully: 'Reservation added successfully!',
    deletedSuccessfully: 'Reservation deleted successfully!',
    selectedDeleted: '{count} reservations deleted successfully!',
    deleteSelected: 'Delete Selected',
    selected: 'selected',
    copyFileNumber: 'Copy File Number',
    duplicate: 'Duplicate',
    convertToInvoice: 'Convert To Invoice',
    fileNumberCopied: 'File number copied to clipboard!',
    duplicatedSuccessfully: 'Reservation duplicated successfully!',
    convertedToInvoice: 'Converted to invoice successfully!'
  };

  const handleFormChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const clearForm = () => {
    setFormData({
      chooseType: '',
      relatedAccount: '',
      salesOfficer: '',
      currency: 'EGP',
      followUp: '',
      branch: '',
      dateOfInvoice: '2025-10-27',
      invoiceNo: '',
      tag2: '',
      destination: '',
      notesOfInvoice: '',
      progress: 'Pending',
      confirmStatus: 'UnConfirmed'
    });
    setHideVat(true);
    setEditingReservation(null);
  };

  const handleAddReservation = async () => {
    try {
      if (editingReservation) {
        // Update existing reservation
        const updateData = {
          client: formData.relatedAccount || editingReservation.client,
          salesOfficer: formData.salesOfficer || editingReservation.salesOfficer,
          branch: formData.branch || editingReservation.branch,
          currency: formData.currency,
          followUp: formData.followUp || editingReservation.followUp,
          dateOfInvoice: formData.dateOfInvoice,
          invoiceNo: formData.invoiceNo || editingReservation.invoiceNo,
          destination: formData.destination || editingReservation.destination,
          type: formData.chooseType || editingReservation.type,
          notes: formData.notesOfInvoice,
          hideVat: hideVat,
          progress: formData.progress || editingReservation.progress,
          confirmStatus: formData.confirmStatus || editingReservation.confirmStatus
        };
        
        const response = await reservationsAPI.update(editingReservation._id || editingReservation.id, updateData);
        
        if (response.status === 'success') {
          // Refresh reservations list
          if (onRefreshReservations) await onRefreshReservations();
          
          // Show toast notification
          const toast = document.createElement('div');
          toast.className = 'toast-notification toast-success';
          toast.textContent = `Reservation #${editingReservation.fileNumber} updated successfully!`;
          document.body.appendChild(toast);
          
          setTimeout(() => toast.classList.add('toast-show'), 10);
          setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => document.body.removeChild(toast), 300);
          }, 2500);
          
          setEditingReservation(null);
        }
      } else {
        // Create a new reservation
        const newReservationData = {
          client: formData.relatedAccount || 'N/A',
          phone: '-',
          dateOfInvoice: formData.dateOfInvoice,
          followUp: formData.followUp || '-',
          amount: '-',
          branch: formData.branch || '-',
          salesOfficer: formData.salesOfficer || '-',
          progress: 'Pending',
          confirmStatus: 'UnConfirmed',
          invoiceNo: formData.invoiceNo || '-',
          type: formData.chooseType,
          destination: formData.destination || '-',
          currency: formData.currency,
          notes: formData.notesOfInvoice,
          hideVat: hideVat
        };

        const response = await reservationsAPI.create(newReservationData);
        
        if (response.status === 'success') {
          // Refresh reservations list
          if (onRefreshReservations) await onRefreshReservations();
          
          // Show toast notification
          const toast = document.createElement('div');
          toast.className = 'toast-notification toast-success';
          toast.textContent = `${t.addedSuccessfully} File #: ${response.data.fileNumber}`;
          document.body.appendChild(toast);
          
          setTimeout(() => toast.classList.add('toast-show'), 10);
          setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => document.body.removeChild(toast), 300);
          }, 2500);
        }
      }
      
      setShowAddModal(false);
      clearForm();
    } catch (error) {
      console.error('Failed to save reservation:', error);
      alert('Failed to save reservation: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteReservation = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        const deletedReservation = reservations.find(r => (r._id || r.id) === id);
        const response = await reservationsAPI.delete(id);
        
        if (response.status === 'success') {
          // Refresh reservations list
          if (onRefreshReservations) await onRefreshReservations();
          
          // Show toast notification
          const toast = document.createElement('div');
          toast.className = 'toast-notification toast-success';
          toast.textContent = `${t.deletedSuccessfully} File #: ${deletedReservation.fileNumber}`;
          document.body.appendChild(toast);
          
          setTimeout(() => toast.classList.add('toast-show'), 10);
          setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => document.body.removeChild(toast), 300);
          }, 2500);
        }
      } catch (error) {
        console.error('Failed to delete reservation:', error);
        alert('Failed to delete reservation: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedReservations.length === 0) return;
    
    const confirmMessage = t.confirmDeleteSelected.replace('{count}', selectedReservations.length);
    
    if (window.confirm(confirmMessage)) {
      try {
        const count = selectedReservations.length;
        const response = await reservationsAPI.bulkDelete(selectedReservations);
        
        if (response.status === 'success') {
          // Refresh reservations list
          if (onRefreshReservations) await onRefreshReservations();
          setSelectedReservations([]);
          
          // Show toast notification
          const toast = document.createElement('div');
          toast.className = 'toast-notification toast-success';
          toast.textContent = t.selectedDeleted.replace('{count}', count);
          document.body.appendChild(toast);
          
          setTimeout(() => toast.classList.add('toast-show'), 10);
          setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => document.body.removeChild(toast), 300);
          }, 2500);
        }
      } catch (error) {
        console.error('Failed to delete reservations:', error);
        alert('Failed to delete reservations: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedReservations.length === filteredReservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(filteredReservations.map(r => r.id));
    }
  };

  const toggleSelectReservation = (id) => {
    if (selectedReservations.includes(id)) {
      setSelectedReservations(selectedReservations.filter(rId => rId !== id));
    } else {
      setSelectedReservations([...selectedReservations, id]);
    }
  };

  const handleSearchFilterChange = (field, value) => {
    setSearchFilters({
      ...searchFilters,
      [field]: value
    });
  };

  const clearSearchFilters = () => {
    setSearchFilters({
      fileNumber: '',
      client: '',
      phone: '',
      branch: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const performSearch = () => {
    setShowSearchModal(false);
  };

  // Filter reservations based on search
  const filteredReservations = reservations.filter(reservation => {
    if (searchFilters.fileNumber && !reservation.fileNumber.includes(searchFilters.fileNumber)) {
      return false;
    }
    if (searchFilters.client && !reservation.client.toLowerCase().includes(searchFilters.client.toLowerCase())) {
      return false;
    }
    if (searchFilters.phone && !reservation.phone.includes(searchFilters.phone)) {
      return false;
    }
    if (searchFilters.branch && reservation.branch !== searchFilters.branch) {
      return false;
    }
    if (searchFilters.dateFrom && reservation.date < searchFilters.dateFrom) {
      return false;
    }
    if (searchFilters.dateTo && reservation.date > searchFilters.dateTo) {
      return false;
    }
    return true;
  });

  const downloadPDF = () => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reservations Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            direction: ${isArabic ? 'rtl' : 'ltr'};
          }
          h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
          }
          .info {
            margin-bottom: 20px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 11px;
          }
          th {
            background-color: #2196f3;
            color: white;
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
          }
          td {
            padding: 8px;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .status-confirmed {
            background-color: #d4edda;
            color: #155724;
            padding: 3px 8px;
            border-radius: 3px;
            font-weight: bold;
          }
          .status-unconfirmed {
            background-color: #f8d7da;
            color: #721c24;
            padding: 3px 8px;
            border-radius: 3px;
            font-weight: bold;
          }
          .status-pending {
            background-color: #fff3cd;
            color: #856404;
            padding: 3px 8px;
            border-radius: 3px;
            font-weight: bold;
          }
          .status-complete {
            background-color: #d4edda;
            color: #155724;
            padding: 3px 8px;
            border-radius: 3px;
            font-weight: bold;
          }
          @media print {
            body { margin: 0; }
            @page { margin: 1cm; }
          }
        </style>
      </head>
      <body>
        <h1>${t.reservations} ${isArabic ? 'تقرير' : 'Report'}</h1>
        <div class="info">
          <strong>${isArabic ? 'التاريخ:' : 'Date:'}</strong> ${new Date().toLocaleDateString()} <br>
          <strong>${isArabic ? 'إجمالي الحجوزات:' : 'Total Reservations:'}</strong> ${filteredReservations.length}
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>${t.fileNumber}</th>
              <th>${t.client}</th>
              <th>${t.phone}</th>
              <th>${t.date}</th>
              <th>${t.branch}</th>
              <th>${t.salesOfficer}</th>
              <th>${t.progress}</th>
              <th>${t.confirmStatus}</th>
              <th>${t.invoiceNo}</th>
              <th>${t.updatedAt}</th>
            </tr>
          </thead>
          <tbody>
            ${filteredReservations.map((r, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${r.fileNumber}</td>
                <td>${r.client}</td>
                <td>${r.phone}</td>
                <td>${r.date}</td>
                <td>${r.branch}</td>
                <td>${r.salesOfficer}</td>
                <td><span class="status-${r.progress.toLowerCase()}">${r.progress}</span></td>
                <td><span class="status-${r.confirmStatus.toLowerCase()}">${r.confirmStatus}</span></td>
                <td>${r.invoiceNo}</td>
                <td>${r.updatedAt}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '', 'width=1200,height=800');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print dialog
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);

    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-success';
    toast.textContent = isArabic ? 'تم فتح نافذة الطباعة - اختر حفظ كـ PDF' : 'Print dialog opened - Choose Save as PDF';
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('toast-show'), 10);
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const downloadExcel = () => {
    // Simple CSV export
    const headers = ['ID', 'File Number', 'Client', 'Phone', 'Date', 'Follow Up', 'Amount', 'User', 'Branch', 'Sales Officer', 'Progress', 'Confirm Status', 'Date of Invoice', 'Invoice No', 'Manual Invoice Serial', 'Manual Invoice ID', 'Manual Invoice Date', 'Updated By', 'Updated At'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n"
      + filteredReservations.map(r => 
          `${r.id},${r.fileNumber},${r.client},${r.phone},${r.date},${r.followUp},${r.amount},${r.user},${r.branch},${r.salesOfficer},${r.progress},${r.confirmStatus},${r.dateOfInvoice},${r.invoiceNo},${r.manualInvoiceSerial},${r.manualInvoiceID},${r.manualInvoiceDate},${r.updatedBy},"${r.updatedAt}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reservations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = () => {
    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.txt';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const lines = content.split('\n');
          
          // Skip header line and parse CSV
          const importedReservations = [];
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const fields = line.split(',');
            if (fields.length < 8) continue;
            
            const reservation = {
              id: reservations.length > 0 ? Math.max(...reservations.map(r => r.id)) + importedReservations.length + 1 : importedReservations.length + 1,
              fileNumber: fields[1] || '30' + Math.floor(100000 + Math.random() * 900000),
              client: fields[2] || 'N/A',
              phone: fields[3] || '-',
              date: fields[4] || new Date().toISOString().split('T')[0],
              followUp: fields[5] || '-',
              amount: fields[6] || '-',
              user: fields[7] || 'Etolv',
              branch: fields[8] || 'Cairo',
              salesOfficer: fields[9] || '-',
              progress: fields[10] || 'Pending',
              confirmStatus: fields[11] || 'UnConfirmed',
              dateOfInvoice: fields[12] || fields[4] || new Date().toISOString().split('T')[0],
              invoiceNo: fields[13] || '-',
              manualInvoiceSerial: fields[14] || '-',
              manualInvoiceID: fields[15] || '-',
              manualInvoiceDate: fields[16] || '-',
              updatedBy: 'Etolv',
              updatedAt: new Date().toLocaleString(),
              type: 'imported',
              destination: '-',
              currency: 'EGP',
              notes: '',
              hideVat: true
            };
            
            importedReservations.push(reservation);
          }
          
          if (importedReservations.length > 0) {
            setReservations([...importedReservations, ...reservations]);
            
            // Show toast notification
            const toast = document.createElement('div');
            toast.className = 'toast-notification toast-success';
            toast.textContent = `${isArabic ? 'تم استيراد' : 'Successfully imported'} ${importedReservations.length} ${isArabic ? 'حجز' : 'reservations'}!`;
            document.body.appendChild(toast);
            
            setTimeout(() => toast.classList.add('toast-show'), 10);
            setTimeout(() => {
              toast.classList.remove('toast-show');
              setTimeout(() => document.body.removeChild(toast), 300);
            }, 3000);
          } else {
            alert(isArabic ? 'لم يتم العثور على بيانات صالحة في الملف' : 'No valid data found in file');
          }
        } catch (error) {
          alert(isArabic ? 'خطأ في قراءة الملف: ' + error.message : 'Error reading file: ' + error.message);
        }
      };
      
      reader.readAsText(file);
      document.body.removeChild(fileInput);
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const downloadTemplate = () => {
    // Create a CSV template file
    const headers = ['ID', 'File Number', 'Client', 'Phone', 'Date', 'Follow Up', 'Amount', 'User', 'Branch', 'Sales Officer', 'Progress', 'Confirm Status', 'Date of Invoice', 'Invoice No', 'Manual Invoice Serial', 'Manual Invoice ID', 'Manual Invoice Date', 'Updated By', 'Updated At'];
    const sampleRow1 = ['1', '30155203', 'Charter-Trip-TRN0725', '01234567890', '2025-10-24', 'Confirmed', '5000 EGP', 'Etolv', 'Cairo', 'Mohammed', 'Complete', 'Confirmed', '2025-10-24', '423', '11', '30078172', '2025-10-17', 'Etolv', new Date().toLocaleString()];
    const sampleRow2 = ['2', '30154975', 'ABDULLAH ALESSA', '01198765432', '2025-10-24', 'Pending', '3500 EGP', 'Etolv', 'Luxor', 'Any', 'Pending', 'UnConfirmed', '2025-10-24', '333', '-', '-', '-', 'Etolv', new Date().toLocaleString()];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n"
      + sampleRow1.join(',') + "\n"
      + sampleRow2.join(',');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reservations_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-success';
    toast.textContent = isArabic ? 'تم تنزيل نموذج CSV' : 'CSV template downloaded';
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('toast-show'), 10);
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);
  };

  const showExample = () => {
    // Add multiple example reservations
    const exampleReservations = [
      {
        id: Date.now(),
        fileNumber: '30155203',
        client: 'Charter-Trip-TRN0725',
        phone: '01234567890',
        date: '2025-10-24',
        followUp: 'موكد',
        amount: '5000 EGP',
        user: 'Etolv',
        branch: 'Cairo',
        salesOfficer: 'Mohammed',
        progress: 'Complete',
        confirmStatus: 'Confirmed',
        dateOfInvoice: '2025-10-24',
        invoiceNo: '423',
        manualInvoiceSerial: '11',
        manualInvoiceID: '30078172',
        manualInvoiceDate: '2025-10-17',
        updatedBy: 'Etolv',
        updatedAt: new Date().toLocaleString(),
        type: 'corporate',
        destination: 'Cairo',
        currency: 'EGP',
        notes: 'Corporate trip to Cairo',
        hideVat: true
      },
      {
        id: Date.now() + 1,
        fileNumber: '30154975',
        client: 'ABDULLAH ALESSA',
        phone: '01198765432',
        date: '2025-10-24',
        followUp: 'موكد ومدفوع كامل',
        amount: '3500 EGP',
        user: 'Etolv',
        branch: 'Luxor',
        salesOfficer: 'Any',
        progress: 'Pending',
        confirmStatus: 'UnConfirmed',
        dateOfInvoice: '2025-10-24',
        invoiceNo: '333',
        manualInvoiceSerial: '-',
        manualInvoiceID: '-',
        manualInvoiceDate: '-',
        updatedBy: 'Etolv',
        updatedAt: new Date().toLocaleString(),
        type: 'individual',
        destination: 'Alexandria',
        currency: 'EGP',
        notes: 'Individual booking',
        hideVat: false
      },
      {
        id: Date.now() + 2,
        fileNumber: '30069917',
        client: 'Jone',
        phone: '-',
        date: '2025-10-22',
        followUp: 'موكد',
        amount: '-',
        user: 'Etolv',
        branch: 'Cairo',
        salesOfficer: 'عبدالله حامد',
        progress: 'Pending',
        confirmStatus: 'UnConfirmed',
        dateOfInvoice: '2025-10-22',
        invoiceNo: '-',
        manualInvoiceSerial: '-',
        manualInvoiceID: '-',
        manualInvoiceDate: '-',
        updatedBy: 'Etolv',
        updatedAt: new Date().toLocaleString(),
        type: 'travel_agent',
        destination: 'Luxor',
        currency: 'USD',
        notes: '',
        hideVat: true
      }
    ];
    
    setReservations([...exampleReservations, ...reservations]);
    
    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-success';
    toast.textContent = `${isArabic ? 'تم إضافة' : 'Added'} ${exampleReservations.length} ${isArabic ? 'أمثلة' : 'example reservations'}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('toast-show'), 10);
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);
  };

  // Context Menu Functions
  const handleContextMenu = (e, reservation) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      reservation: reservation
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, reservation: null });
  };

  const handleCopyFileNumber = async () => {
    if (contextMenu.reservation) {
      try {
        await navigator.clipboard.writeText(contextMenu.reservation.fileNumber);
        // Create a temporary toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = `${t.fileNumberCopied} (${contextMenu.reservation.fileNumber})`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.classList.add('toast-show');
        }, 10);
        
        setTimeout(() => {
          toast.classList.remove('toast-show');
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 300);
        }, 2000);
      } catch (err) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = contextMenu.reservation.fileNumber;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(t.fileNumberCopied);
      }
      handleCloseContextMenu();
    }
  };

  const handleDuplicate = () => {
    if (contextMenu.reservation) {
      const duplicated = {
        ...contextMenu.reservation,
        id: reservations.length > 0 ? Math.max(...reservations.map(r => r.id)) + 1 : 1,
        fileNumber: '30' + Math.floor(100000 + Math.random() * 900000),
        invoiceNo: '-',
        manualInvoiceSerial: '-',
        manualInvoiceID: '-',
        manualInvoiceDate: '-',
        updatedAt: new Date().toLocaleString(),
        progress: 'Pending',
        confirmStatus: 'UnConfirmed'
      };
      setReservations([duplicated, ...reservations]);
      
      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'toast-notification toast-success';
      toast.textContent = `${t.duplicatedSuccessfully} New File #: ${duplicated.fileNumber}`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('toast-show');
      }, 10);
      
      setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
      
      handleCloseContextMenu();
    }
  };

  const handleConvertToInvoice = () => {
    if (contextMenu.reservation) {
      // Update the reservation to mark it as converted
      const updatedReservations = reservations.map(r => {
        if (r.id === contextMenu.reservation.id) {
          const invoiceNumber = Math.floor(100 + Math.random() * 900);
          return {
            ...r,
            invoiceNo: invoiceNumber.toString(),
            confirmStatus: 'Confirmed',
            progress: 'Complete',
            dateOfInvoice: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toLocaleString()
          };
        }
        return r;
      });
      
      setReservations(updatedReservations);
      
      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'toast-notification toast-success';
      toast.textContent = `${t.convertedToInvoice} File #: ${contextMenu.reservation.fileNumber}`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('toast-show');
      }, 10);
      
      setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
      
      handleCloseContextMenu();
    }
  };

  const handleEditFromContext = () => {
    if (contextMenu.reservation) {
      // Store which reservation we're editing
      setEditingReservation(contextMenu.reservation);
      
      // Populate the form with reservation data
      setFormData({
        chooseType: contextMenu.reservation.type || '',
        relatedAccount: contextMenu.reservation.client || '',
        salesOfficer: contextMenu.reservation.salesOfficer || '',
        currency: contextMenu.reservation.currency || 'EGP',
        followUp: contextMenu.reservation.followUp !== '-' ? contextMenu.reservation.followUp : '',
        branch: contextMenu.reservation.branch !== '-' ? contextMenu.reservation.branch : '',
        dateOfInvoice: contextMenu.reservation.dateOfInvoice || '',
        invoiceNo: contextMenu.reservation.invoiceNo !== '-' ? contextMenu.reservation.invoiceNo : '',
        tag2: '',
        destination: contextMenu.reservation.destination !== '-' ? contextMenu.reservation.destination : '',
        notesOfInvoice: contextMenu.reservation.notes || '',
        progress: contextMenu.reservation.progress || 'Pending',
        confirmStatus: contextMenu.reservation.confirmStatus || 'UnConfirmed'
      });
      
      setHideVat(contextMenu.reservation.hideVat !== undefined ? contextMenu.reservation.hideVat : true);
      setShowAddModal(true);
      handleCloseContextMenu();
    }
  };

  // Close context menu when clicking anywhere
  useEffect(() => {
    const handleClick = () => handleCloseContextMenu();
    if (contextMenu.visible) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu.visible]);

  return (
    <div className="reservations-page">
      <div className="reservations-header-section">
        <h1 className="reservations-title">{t.reservations}</h1>
      </div>

      <div className="reservations-actions">
        <div className="reservations-actions-buttons">
          <button className="add-btn-green" onClick={() => setShowAddModal(true)}>
            <span className="btn-icon">➕</span>
            {t.add}
          </button>
          <button className="search-btn-blue" onClick={() => setShowSearchModal(true)}>
            <span className="btn-icon">🔍</span>
            {t.search}
          </button>
          {selectedReservations.length > 0 && (
            <button className="delete-selected-btn" onClick={handleDeleteSelected}>
              <span className="btn-icon">🗑️</span>
              {t.deleteSelected} ({selectedReservations.length})
            </button>
          )}
        </div>
        {selectedReservations.length > 0 && (
          <div className="selection-info">
            {selectedReservations.length} {t.selected}
          </div>
        )}
      </div>

      <div className="reservations-table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input 
                  type="checkbox" 
                  checked={selectedReservations.length === filteredReservations.length && filteredReservations.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>#</th>
              <th>{t.fileNumber}</th>
              <th>{t.client}</th>
              <th>{t.phone}</th>
              <th>{t.date}</th>
              <th>{t.followUp}</th>
              <th>{t.amount}</th>
              <th>{t.user}</th>
              <th>{t.branch}</th>
              <th>{t.salesOfficer}</th>
              <th>{t.progress}</th>
              <th>{t.confirmStatus}</th>
              <th>{t.dateOfInvoice}</th>
              <th>{t.invoiceNo}</th>
              <th>{t.manualInvoiceSerial}</th>
              <th>{t.manualInvoiceID}</th>
              <th>{t.manualInvoiceDate}</th>
              <th>{t.updatedBy}</th>
              <th>{t.updatedAt}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="21" className="empty-message">
                  {t.noData}
                </td>
              </tr>
            ) : (
              filteredReservations.map((reservation, index) => (
                <tr 
                  key={reservation.id}
                  onContextMenu={(e) => handleContextMenu(e, reservation)}
                >
                  <td className="checkbox-col">
                    <input 
                      type="checkbox" 
                      checked={selectedReservations.includes(reservation.id)}
                      onChange={() => toggleSelectReservation(reservation.id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{reservation.fileNumber}</td>
                  <td>{reservation.client}</td>
                  <td>{reservation.phone}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.followUp}</td>
                  <td>{reservation.amount}</td>
                  <td>{reservation.user}</td>
                  <td>{reservation.branch}</td>
                  <td>{reservation.salesOfficer}</td>
                  <td>
                    <span className={`status-badge status-${reservation.progress.toLowerCase().replace(/\s+/g, '-')}`}>
                      {reservation.progress}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${reservation.confirmStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                      {reservation.confirmStatus}
                    </span>
                  </td>
                  <td>{reservation.dateOfInvoice}</td>
                  <td>{reservation.invoiceNo}</td>
                  <td>{reservation.manualInvoiceSerial}</td>
                  <td>{reservation.manualInvoiceID}</td>
                  <td>{reservation.manualInvoiceDate}</td>
                  <td>{reservation.updatedBy}</td>
                  <td>{reservation.updatedAt}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="action-btn edit-btn" 
                        title={t.edit}
                        onClick={() => alert('Edit functionality - Would open edit modal')}
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title={t.delete}
                        onClick={() => handleDeleteReservation(reservation.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="reservations-footer">
        <div className="reservations-footer-actions">
          <button className="download-pdf-btn" onClick={downloadPDF}>
            <span className="btn-icon">📄</span>
            {t.downloadPDF}
          </button>
          <button className="download-excel-btn" onClick={downloadExcel}>
            <span className="btn-icon">📊</span>
            {t.downloadExcel}
          </button>
          <button className="import-btn" onClick={importData}>
            <span className="btn-icon">📥</span>
            {t.import}
          </button>
          <button className="example-btn" onClick={showExample} title={isArabic ? 'إضافة بيانات مثال' : 'Add example data'}>
            <span className="btn-icon">📋</span>
            {t.example}
          </button>
          <button className="example-btn" onClick={downloadTemplate} title={isArabic ? 'تحميل نموذج CSV للاستيراد' : 'Download CSV template for import'}>
            <span className="btn-icon">📥</span>
            {isArabic ? 'نموذج' : 'Template'}
          </button>
        </div>
        <div className="reservations-pagination">
          <span className="result-text">
            {t.result}: {filteredReservations.length} {t.of} {reservations.length} {t.total}
          </span>
          <div className="pagination-controls">
            <button className="pagination-refresh" onClick={() => window.location.reload()}>🔄</button>
            <select 
              className="pagination-select"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Reservation Modal */}
      {showAddModal && (
        <div className="reservation-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="reservation-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="reservation-modal-header">
              <div className="reservation-modal-title">
                <span className="reservation-modal-icon">{editingReservation ? '✏️' : '➕'}</span>
                <h2>{editingReservation ? (isArabic ? 'تعديل الحجز' : 'Edit Reservation') : t.addReservation}</h2>
              </div>
              <button className="modal-close" onClick={() => { setShowAddModal(false); clearForm(); }}>✕</button>
            </div>
            
            <div className="reservation-modal-body">
              <div className="reservation-form-grid">
                {/* Choose Type */}
                <div className="reservation-form-field">
                  <label className="reservation-label">{t.chooseType}</label>
                  <select 
                    className="reservation-form-select"
                    value={formData.chooseType}
                    onChange={(e) => handleFormChange('chooseType', e.target.value)}
                  >
                    <option value="">{t.selectLedger}</option>
                    <option value="individual">Individual</option>
                    <option value="corporate">Corporate</option>
                    <option value="government">Government</option>
                    <option value="travel_agent">Travel Agent</option>
                    <option value="tour_operator">Tour Operator</option>
                  </select>
                </div>

                {/* Related Account */}
                <div className="reservation-form-field">
                  <label className="reservation-label">
                    {t.relatedAccount} <span className="required">*</span>
                  </label>
                  <select 
                    className="reservation-form-select"
                    value={formData.relatedAccount}
                    onChange={(e) => handleFormChange('relatedAccount', e.target.value)}
                  >
                    <option value="">{isArabic ? 'بحث' : 'Search'}</option>
                    <option value="account1">Account 1</option>
                    <option value="account2">Account 2</option>
                  </select>
                </div>

                {/* Sales Officer */}
                <div className="reservation-form-field">
                  <label className="reservation-label">
                    {t.salesOfficer} <span className="required">*</span>
                  </label>
                  <select 
                    className="reservation-form-select"
                    value={formData.salesOfficer}
                    onChange={(e) => handleFormChange('salesOfficer', e.target.value)}
                  >
                    <option value="">{t.salesOfficer}</option>
                    <option value="officer1">Officer 1</option>
                    <option value="officer2">Officer 2</option>
                  </select>
                </div>

                {/* Currency */}
                <div className="reservation-form-field">
                  <label className="reservation-label">
                    {t.currency} <span className="required">*</span>
                  </label>
                  <div className="currency-input-wrapper">
                    <select 
                      className="reservation-form-select with-clear"
                      value={formData.currency}
                      onChange={(e) => handleFormChange('currency', e.target.value)}
                    >
                      <option value="EGP">EGP</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="SAR">SAR</option>
                    </select>
                    <button 
                      type="button"
                      className="currency-clear-btn" 
                      onClick={() => handleFormChange('currency', 'EGP')}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Follow up */}
                <div className="reservation-form-field">
                  <label className="reservation-label">{t.followUp}</label>
                  <select 
                    className="reservation-form-select"
                    value={formData.followUp}
                    onChange={(e) => handleFormChange('followUp', e.target.value)}
                  >
                    <option value="">{t.selectStatus}</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>

                {/* Branch */}
                <div className="reservation-form-field">
                  <label className="reservation-label">
                    {t.branch} <span className="required">*</span>
                  </label>
                  <select 
                    className="reservation-form-select"
                    value={formData.branch}
                    onChange={(e) => handleFormChange('branch', e.target.value)}
                  >
                    <option value="">{isArabic ? 'الفرع' : 'Branch'}</option>
                    <option value="Cairo">Cairo</option>
                    <option value="Luxor">Luxor</option>
                    <option value="Aswan">Aswan</option>
                  </select>
                </div>

                {/* Date of invoice */}
                <div className="reservation-form-field">
                  <label className="reservation-label">{t.dateOfInvoice}</label>
                  <div className="date-input-wrapper">
                    <input 
                      type="date" 
                      className="reservation-form-input date-input"
                      value={formData.dateOfInvoice}
                      onChange={(e) => handleFormChange('dateOfInvoice', e.target.value)}
                    />
                    <button 
                      type="button"
                      className="date-clear-btn" 
                      onClick={() => handleFormChange('dateOfInvoice', new Date().toISOString().split('T')[0])}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Invoice No. */}
                <div className="reservation-form-field">
                  <label className="reservation-label">{t.invoiceNo}</label>
                  <input 
                    type="text" 
                    className="reservation-form-input"
                    placeholder=""
                    value={formData.invoiceNo}
                    onChange={(e) => handleFormChange('invoiceNo', e.target.value)}
                  />
                </div>

                {/* Hide Vat Checkbox - Moved here */}
                <div className="reservation-form-field checkbox-inline">
                  <label className="reservation-checkbox-label-inline">
                    <input 
                      type="checkbox" 
                      className="reservation-checkbox"
                      checked={hideVat}
                      onChange={(e) => setHideVat(e.target.checked)}
                    />
                    <span className="checkbox-text">{t.hideVat}</span>
                  </label>
                </div>
              </div>

              {/* Notes of invoice */}
              <div className="reservation-form-field-full">
                <label className="reservation-label">{t.notesOfInvoice}</label>
                <textarea 
                  className="reservation-form-textarea"
                  rows="3"
                  value={formData.notesOfInvoice}
                  onChange={(e) => handleFormChange('notesOfInvoice', e.target.value)}
                />
              </div>
            </div>

            <div className="reservation-modal-footer">
              <button className="reservation-clear-btn" onClick={clearForm}>
                {t.clear}
              </button>
              <button className="reservation-add-btn" onClick={handleAddReservation}>
                {editingReservation ? (isArabic ? 'حفظ' : 'Save') : (isArabic ? 'إضافة ملف' : 'Add file')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="reservation-modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="reservation-modal-content search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reservation-modal-header">
              <div className="reservation-modal-title">
                <span className="reservation-modal-icon">🔍</span>
                <h2>{t.searchReservations}</h2>
              </div>
              <button className="modal-close" onClick={() => setShowSearchModal(false)}>✕</button>
            </div>
            
            <div className="reservation-modal-body">
              <div className="reservation-form-grid">
                {/* File Number */}
                <div className="reservation-form-field">
                  <label className="reservation-label">{t.fileNumber}</label>
                  <input 
                    type="text" 
                    className="reservation-form-input"
                    placeholder={t.fileNumber}
                    value={searchFilters.fileNumber}
                    onChange={(e) => handleSearchFilterChange('fileNumber', e.target.value)}
                  />
                </div>

                {/* Client */}
                <div className="reservation-form-field">
                  <label className="reservation-label">{t.client}</label>
                  <input 
                    type="text" 
                    className="reservation-form-input"
                    placeholder={t.client}
                    value={searchFilters.client}
                    onChange={(e) => handleSearchFilterChange('client', e.target.value)}
                  />
                </div>

                {/* Phone */}
                <div className="reservation-form-field">
                  <label className="reservation-label">{t.phone}</label>
                  <input 
                    type="text" 
                    className="reservation-form-input"
                    placeholder={t.phone}
                    value={searchFilters.phone}
                    onChange={(e) => handleSearchFilterChange('phone', e.target.value)}
                  />
                </div>

                {/* Branch */}
                <div className="reservation-form-field">
                  <label className="reservation-label">{t.branch}</label>
                  <select 
                    className="reservation-form-select"
                    value={searchFilters.branch}
                    onChange={(e) => handleSearchFilterChange('branch', e.target.value)}
                  >
                    <option value="">All Branches</option>
                    <option value="Cairo">Cairo</option>
                    <option value="Luxor">Luxor</option>
                    <option value="Aswan">Aswan</option>
                  </select>
                </div>

                {/* Date From */}
                <div className="reservation-form-field">
                  <label className="reservation-label">{t.dateFrom}</label>
                  <input 
                    type="date" 
                    className="reservation-form-input"
                    value={searchFilters.dateFrom}
                    onChange={(e) => handleSearchFilterChange('dateFrom', e.target.value)}
                  />
                </div>

                {/* Date To */}
                <div className="reservation-form-field">
                  <label className="reservation-label">{t.dateTo}</label>
                  <input 
                    type="date" 
                    className="reservation-form-input"
                    value={searchFilters.dateTo}
                    onChange={(e) => handleSearchFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="reservation-modal-footer">
              <button className="reservation-clear-btn" onClick={clearSearchFilters}>
                {t.clear}
              </button>
              <button className="reservation-add-btn" onClick={performSearch}>
                <span className="btn-icon">🔍</span>
                {t.search}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div 
          className="context-menu"
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
        >
          <div className="context-menu-item" onClick={handleEditFromContext}>
            <span className="context-menu-icon">✏️</span>
            {t.edit}
          </div>
          <div className="context-menu-item" onClick={handleCopyFileNumber}>
            <span className="context-menu-icon">📋</span>
            {t.copyFileNumber}
          </div>
          <div className="context-menu-item" onClick={handleDuplicate}>
            <span className="context-menu-icon">📑</span>
            {t.duplicate}
          </div>
          <div className="context-menu-item" onClick={handleConvertToInvoice}>
            <span className="context-menu-icon">📄</span>
            {t.convertToInvoice}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationsPage;

