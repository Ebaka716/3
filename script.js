// Initialize Quill editor
var quill = new Quill('#editor-container', {
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ]
    },
    placeholder: 'Compose your content here...',
    theme: 'snow'
});

// Initialize second Quill editor for Tab Two
var quill2 = new Quill('#editor-container2', {
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ]
    },
    placeholder: 'Compose your content here...',
    theme: 'snow'
});

// Initialize third Quill editor for Tab Three
var quill3 = new Quill('#editor-container3', {
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ]
    },
    placeholder: 'Paste content here for AI processing...', // Changed placeholder
    theme: 'snow'
});

// Initialize markdown-it
var md = window.markdownit();

// Initialize Showdown
var converter = new showdown.Converter();

// Track current format
var currentFormat = 'html';
var currentFormat2 = 'html';
var currentFormat3 = 'html'; // Added for tab 3

// Import mode
var importMode = 'word'; // Default import mode
var requestingImportTab = null; // Track which tab requested import

// Modal Elements
const importModal = document.getElementById('importModal');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalProceed = document.getElementById('modalProceed');
const modalOptions = document.querySelectorAll('.modal-option');

// View switching elements
const navItems = document.querySelectorAll('.nav-item');
const viewContainers = document.querySelectorAll('.view-container');

// Handle view switching
navItems.forEach(item => {
    item.addEventListener('click', function() {
        // Get the view to show
        const viewToShow = this.getAttribute('data-view');
        
        // Update active nav item
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
        });
        this.classList.add('active');
        
        // Update visible view
        viewContainers.forEach(viewContainer => {
            viewContainer.classList.remove('active');
        });
        document.getElementById(viewToShow).classList.add('active');
        
        // Toggle body class for floating button
        if (viewToShow === 'tab-two') {
            document.body.classList.add('tab-two-active');
        } else {
            document.body.classList.remove('tab-two-active');
        }
    });
});

// Sidebar toggle functionality
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.nav-sidebar');

sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    
    // Change toggle button icon based on sidebar state
    if (sidebar.classList.contains('collapsed')) {
        sidebarToggle.innerHTML = `
            <svg class="sidebar-toggle-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;
    } else {
        sidebarToggle.innerHTML = `
            <svg class="sidebar-toggle-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        `;
    }
});

// Update previews when the editor content changes
quill.on('text-change', function() {
    updatePreviews();
});

// Update previews for second editor
quill2.on('text-change', function() {
    updatePreviews2();
});

// Update previews for third editor
quill3.on('text-change', function() {
    updatePreviews3();
});

// Initialize file import functionality
document.getElementById('importButton').addEventListener('click', function() {
    requestingImportTab = 1;
    showImportModal();
});

// Initialize file import for second tab
document.getElementById('importButton2').addEventListener('click', function() {
    requestingImportTab = 2;
    showImportModal();
});

// Initialize file import for third tab
document.getElementById('importButton3').addEventListener('click', function() {
    requestingImportTab = 3;
    showImportModal();
});

// Close modal when X is clicked
modalClose.addEventListener('click', closeImportModal);

// Close modal when Cancel is clicked
modalCancel.addEventListener('click', closeImportModal);

// Handle modal option selection
modalOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Remove selected class from all options
        modalOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        this.classList.add('selected');
        
        // Set import mode
        importMode = this.getAttribute('data-import-mode');
    });
});

// Proceed with file selection
modalProceed.addEventListener('click', function() {
    closeImportModal();
    
    // Set accept attribute based on selected import mode
    const activeView = document.querySelector('.view-container.active').id;
    const fileInput = activeView === 'tab-one' ? 
        document.getElementById('fileInput') : 
        document.getElementById('fileInput2');
        
    if (importMode === 'word') {
        fileInput.setAttribute('accept', '.doc,.docx');
    } else {
        fileInput.setAttribute('accept', '.xlsx,.xls');
    }
    
    // Trigger file input
    fileInput.click();
});

// Open import modal
function showImportModal() {
    importModal.style.display = 'flex';
    
    // Set default selected option
    modalOptions.forEach(option => {
        if (option.getAttribute('data-import-mode') === importMode) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Close import modal
function closeImportModal() {
    importModal.style.display = 'none';
}

/**
 * Shared function to process Excel files with configuration options
 * @param {Object} config - Configuration object
 * @param {File} config.file - The Excel file to process
 * @param {Object} config.quillEditor - The Quill editor to insert content into
 * @param {string} config.statusElId - ID of the status element
 * @param {string} config.fileInputId - ID of the file input element
 * @param {Function} config.updatePreviewsFn - Function to update previews
 */
function processExcelFileWithConfig(config) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get first worksheet
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
            let content = '';
            if (importMode === 'excel-cell') {
                // Get cell A1 content or first non-empty cell
                const cellAddress = 'A1'; // Default cell
                const cell = firstSheet[cellAddress];
                content = cell ? cell.v : '';
            } else {
                // Convert to HTML table
                content = XLSX.utils.sheet_to_html(firstSheet);
            }
            
            // Insert into Quill editor
            config.quillEditor.clipboard.dangerouslyPasteHTML(content);
            
            // Show success message
            const statusEl = document.getElementById(config.statusElId);
            if (statusEl) {
                statusEl.textContent = 'File imported successfully!';
                statusEl.className = 'import-status import-success';
            }
            
            // Clear file input
            const fileInput = document.getElementById(config.fileInputId);
            if (fileInput) fileInput.value = '';
            
            // Update previews
            if (config.updatePreviewsFn) config.updatePreviewsFn();
        } catch (error) {
            console.error('Error parsing Excel file:', error);
            const statusEl = document.getElementById(config.statusElId);
            if (statusEl) {
                statusEl.textContent = 'Error importing Excel file: ' + error.message;
                statusEl.className = 'import-status import-error';
            }
            
            // Show global error message
            showGlobalError('Error importing Excel file: ' + error.message);
        }
    };
    reader.onerror = function() {
        const statusEl = document.getElementById(config.statusElId);
        if (statusEl) {
            statusEl.textContent = 'Error reading file';
            statusEl.className = 'import-status import-error';
        }
        
        // Show global error message
        showGlobalError('Error reading file');
    };
    reader.readAsArrayBuffer(config.file);
}

function processExcelFile(file) {
    processExcelFileWithConfig({
        file: file,
        quillEditor: quill,
        statusElId: 'importStatus',
        fileInputId: 'fileInput',
        updatePreviewsFn: updatePreviews
    });
}

function processExcelFile2(file) {
    processExcelFileWithConfig({
        file: file,
        quillEditor: quill2,
        statusElId: 'importStatus2',
        fileInputId: 'fileInput2',
        updatePreviewsFn: updatePreviews2
    });
}

// --- Process Excel for Tab 3 ---
function processExcelFile3(file) {
    processExcelFileWithConfig({
        file: file,
        quillEditor: quill3,
        statusElId: 'importStatus3',
        fileInputId: 'fileInput3',
        updatePreviewsFn: updatePreviews3
    });
}

/**
 * Shared function to process Word files with configuration options
 * @param {Object} config - Configuration object
 * @param {File} config.file - The Word file to process
 * @param {Object} config.quillEditor - The Quill editor to insert content into
 * @param {string} config.statusElId - ID of the status element
 * @param {string} config.fileInputId - ID of the file input element
 * @param {Function} config.updatePreviewsFn - Function to update previews
 */
function processWordFileWithConfig(config) {
    const reader = new FileReader();
    reader.onload = function(e) {
        mammoth.convertToHtml({ arrayBuffer: e.target.result })
            .then(function(result) {
                // Insert into Quill editor
                config.quillEditor.clipboard.dangerouslyPasteHTML(result.value);
                
                // Show success message
                const statusEl = document.getElementById(config.statusElId);
                if (statusEl) {
                    statusEl.textContent = 'Word document imported successfully!';
                    statusEl.className = 'import-status import-success';
                }
                
                // Clear file input
                const fileInput = document.getElementById(config.fileInputId);
                if (fileInput) fileInput.value = '';
                
                // Update previews
                if (config.updatePreviewsFn) config.updatePreviewsFn();
                
                // Log any warnings
                if (result.messages.length > 0) {
                    console.warn('Warnings during Word import:', result.messages);
                }
            })
            .catch(function(error) {
                console.error('Error parsing Word file:', error);
                const statusEl = document.getElementById(config.statusElId);
                if (statusEl) {
                    statusEl.textContent = 'Error importing Word file: ' + error.message;
                    statusEl.className = 'import-status import-error';
                }
            });
    };
    reader.onerror = function() {
        const statusEl = document.getElementById(config.statusElId);
        if (statusEl) {
            statusEl.textContent = 'Error reading file';
            statusEl.className = 'import-status import-error';
        }
    };
    reader.readAsArrayBuffer(config.file);
}

function processWordFile(file) {
    processWordFileWithConfig({
        file: file,
        quillEditor: quill,
        statusElId: 'importStatus',
        fileInputId: 'fileInput',
        updatePreviewsFn: updatePreviews
    });
}

function processWordFile2(file) {
    processWordFileWithConfig({
        file: file,
        quillEditor: quill2,
        statusElId: 'importStatus2',
        fileInputId: 'fileInput2',
        updatePreviewsFn: updatePreviews2
    });
}

// --- Process Word for Tab 3 ---
function processWordFile3(file) {
    processWordFileWithConfig({
        file: file,
        quillEditor: quill3,
        statusElId: 'importStatus3',
        fileInputId: 'fileInput3',
        updatePreviewsFn: updatePreviews3
    });
}

/**
 * Shared function to update previews with configuration options
 * @param {Object} config - Configuration object
 * @param {Object} config.source - Source Quill editor
 * @param {string} config.cardAreaId - ID of card content area to update
 * @param {string} config.rawContentId - ID of the raw content textarea
 * @param {Function} config.formatDisplayFn - Function to call for updating format display
 */
function updatePreviewsWithConfig(config) {
    // Get HTML from the source editor
    const html = config.source.root.innerHTML;
    
    // Update Card Preview if element exists and ID is provided
    if (config.cardAreaId) {
        const cardContentArea = document.getElementById(config.cardAreaId);
        if (cardContentArea) cardContentArea.innerHTML = html;
    }
    
    // Update format display based on current selection
    if (config.formatDisplayFn) config.formatDisplayFn();
    
    // Store raw content if element exists and ID is provided
    if (config.rawContentId) {
        const rawContent = document.getElementById(config.rawContentId);
        if (rawContent) rawContent.value = html;
    }
}

function updatePreviews() {
    // Use the shared function with tab one configuration
    updatePreviewsWithConfig({
        source: quill,
        cardAreaId: 'cardContentArea1',
        rawContentId: 'rawContent',
        formatDisplayFn: updateFormatDisplay
    });
}

function updatePreviews2() {
    // Use the shared function with tab two configuration
    updatePreviewsWithConfig({
        source: quill2,
        cardAreaId: 'cardContentArea2', // Note: This may not exist yet, handled by updatePreviewsAI
        rawContentId: 'rawContent2',
        formatDisplayFn: updateFormatDisplay2
    });
}

// --- Update Previews for Tab 3 ---
function updatePreviews3() {
    // Use the shared function with tab three configuration
    // No card preview area defined for tab 3 yet
    updatePreviewsWithConfig({
        source: quill3,
        cardAreaId: null, // No dedicated card preview for tab 3 initially
        rawContentId: 'rawContent3',
        formatDisplayFn: updateFormatDisplay3
    });
    // Show/Hide clear button based on content
    const clearButton = document.getElementById('clearButton3');
    if (clearButton) {
        clearButton.style.display = quill3.getLength() > 1 ? 'flex' : 'none';
    }
}

/**
 * Shared function to toggle between HTML and Markdown formats
 * @param {Object} config - Configuration object
 * @param {string} config.format - Format to set ('html' or 'markdown')
 * @param {string} config.htmlToggleId - ID of the HTML toggle button
 * @param {string} config.markdownToggleId - ID of the Markdown toggle button
 * @param {Function} config.formatDisplayFn - Function to update the display
 * @param {Function} config.copyButtonTextFn - Function to update copy button text
 * @param {Object} config.formatRef - Reference to the format variable to update
 */
function toggleFormatWithConfig(config) {
    // Update toggle buttons
    document.getElementById(config.htmlToggleId).classList.toggle('active', config.format === 'html');
    document.getElementById(config.markdownToggleId).classList.toggle('active', config.format === 'markdown');
    
    // Save current format by reference
    config.formatRef.current = config.format;
    
    // Update the display
    if (config.formatDisplayFn) config.formatDisplayFn();
    
    // Update copy button text
    if (config.copyButtonTextFn) config.copyButtonTextFn();
}

function toggleFormat(format) {
    toggleFormatWithConfig({
        format: format,
        htmlToggleId: 'htmlToggle',
        markdownToggleId: 'markdownToggle',
        formatDisplayFn: updateFormatDisplay,
        copyButtonTextFn: updateCopyButtonText,
        formatRef: { current: currentFormat }
    });
    // Update the global variable
    currentFormat = format;
}

function toggleFormat2(format) {
    toggleFormatWithConfig({
        format: format,
        htmlToggleId: 'htmlToggle2',
        markdownToggleId: 'markdownToggle2',
        formatDisplayFn: updateFormatDisplay2,
        copyButtonTextFn: updateCopyButtonText2,
        formatRef: { current: currentFormat2 }
    });
    // Update the global variable
    currentFormat2 = format;
}

// --- Toggle Format for Tab 3 ---
function toggleFormat3(format) {
    toggleFormatWithConfig({
        format: format,
        htmlToggleId: 'htmlToggle3',
        markdownToggleId: 'markdownToggle3',
        formatDisplayFn: updateFormatDisplay3,
        copyButtonTextFn: updateCopyButtonText3,
        formatRef: { current: currentFormat3 }
    });
    // Update the global variable
    currentFormat3 = format;
}

/**
 * Shared function to update format display with configuration options
 * @param {Object} config - Configuration object
 * @param {Object} config.source - Source Quill editor
 * @param {string} config.inputTextId - ID of the input text element
 * @param {string|boolean} config.currentFormat - Current format (html or markdown)
 */
function updateFormatDisplayWithConfig(config) {
    const html = config.source.root.innerHTML;
    const inputText = document.getElementById(config.inputTextId);
    
    if (!inputText) return;
    
    if (config.currentFormat === 'html') {
        inputText.value = html;
    } else {
        const markdown = new showdown.Converter().makeMarkdown(html);
        inputText.value = markdown;
    }
}

function updateFormatDisplay() {
    updateFormatDisplayWithConfig({
        source: quill,
        inputTextId: 'inputText',
        currentFormat: currentFormat
    });
}

function updateFormatDisplay2() {
    updateFormatDisplayWithConfig({
        source: quill2,
        inputTextId: 'inputText2',
        currentFormat: currentFormat2
    });
}

// --- Update Format Display for Tab 3 ---
function updateFormatDisplay3() {
    updateFormatDisplayWithConfig({
        source: quill3,
        inputTextId: 'inputText3',
        currentFormat: currentFormat3
    });
}

/**
 * Shared function to update the copy button text based on the current format
 * @param {Object} config - Configuration object
 * @param {string} config.copyButtonId - ID of the copy button
 * @param {string} config.currentFormat - Current format ('html' or 'markdown')
 */
function updateCopyButtonTextWithConfig(config) {
    const copyButton = document.getElementById(config.copyButtonId);
    if (!copyButton) return;
    
    if (config.currentFormat === 'html') {
        copyButton.textContent = 'Copy HTML to Clipboard';
    } else {
        copyButton.textContent = 'Copy Markdown to Clipboard';
    }
}

function updateCopyButtonText() {
    updateCopyButtonTextWithConfig({
        copyButtonId: 'copyButton',
        currentFormat: currentFormat
    });
}

function updateCopyButtonText2() {
    updateCopyButtonTextWithConfig({
        copyButtonId: 'copyButton2',
        currentFormat: currentFormat2
    });
}

// --- Update Copy Button Text for Tab 3 ---
function updateCopyButtonText3() {
    updateCopyButtonTextWithConfig({
        copyButtonId: 'copyButton3',
        currentFormat: currentFormat3
    });
}

/**
 * Shared function to copy content to clipboard
 * @param {Object} config - Configuration object 
 * @param {string} config.inputTextId - ID of the input text element to copy from
 * @param {number} config.tabNumber - Tab number for logging
 */
function copyCurrentFormatWithConfig(config) {
    const inputText = document.getElementById(config.inputTextId);
    if (!inputText) return;
    
    // Copy to clipboard
    inputText.select();
    document.execCommand('copy');
    
    // Show success message
    showSuccessToast("Copied to clipboard!");
    
    // Log what was copied and from where
    console.log(`Copied content from tab ${config.tabNumber}`);
}

function copyCurrentFormat() {
    copyCurrentFormatWithConfig({
        inputTextId: 'inputText',
        tabNumber: 1
    });
}

function copyCurrentFormat2() {
    copyCurrentFormatWithConfig({
        inputTextId: 'inputText2',
        tabNumber: 2
    });
}

function copyCurrentFormat3() {
    copyCurrentFormatWithConfig({
        inputTextId: 'inputText3',
        tabNumber: 3
    });
}

// Update previews specifically after AI formatting
function updatePreviewsAI() {
    // Get HTML from the editor
    const html = quill2.root.innerHTML;
    
    // Create or update a card content area specifically for AI
    let cardContentArea2 = document.getElementById('cardContentArea2');
    if (!cardContentArea2) {
        // Create it if it doesn't exist in the DOM yet
        cardContentArea2 = document.createElement('div');
        cardContentArea2.id = 'cardContentArea2';
    }
    
    // Update the AI preview area
    cardContentArea2.innerHTML = html;
    
    // Also update the modal preview if visible
    const modalCardContentArea = document.getElementById('modalCardContentArea');
    if (modalCardContentArea) {
        modalCardContentArea.parentElement.classList.add('with-intent');
        modalCardContentArea.innerHTML = html;
    }
    
    // Update format display based on current selection
    updateFormatDisplay2();
}

// Show global error
function showGlobalError(errorMessage) {
    const errorContainer = document.getElementById('globalErrorContainer');
    const errorMessageEl = document.getElementById('globalErrorMessage');
    
    // Set the error message
    errorMessageEl.textContent = errorMessage;
    
    // Show the error container
    errorContainer.classList.add('visible');
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        errorContainer.classList.remove('visible');
    }, 10000);
}

// Clear global error
function clearGlobalError() {
    const errorContainer = document.getElementById('globalErrorContainer');
    errorContainer.classList.remove('visible');
}

// Renamed from showCopySuccess and added message/type parameters
function showSuccessToast(message, type = 'success') {
    const toastElement = document.getElementById('copySuccess'); // Keep ID
    if (toastElement) {
        toastElement.innerHTML = message; // Set the message dynamically
        
        // Ensure base class is always present
        toastElement.classList.add('copy-success');
        
        // Add or remove the AI-specific color class
        if (type === 'ai') {
            toastElement.classList.add('toast-ai'); // Add purple class
        } else {
            toastElement.classList.remove('toast-ai'); // Remove purple class for default (green)
        }
        
        toastElement.style.display = 'block';
        setTimeout(() => {
            toastElement.style.display = 'none';
        }, 2000);
    } else {
        console.error("Could not find toast element (copySuccess)!"); // Keep error logging
    }
}

// === Resizable Panes Logic ===
const resizeHandle = document.getElementById('resize-handle');
if (resizeHandle) { // Check if handle exists (only on tab-one)
    const editorPane = document.getElementById('editor-pane');
    const outputPane = document.getElementById('output-pane');
    // const textBox = editorPane.parentElement; // Or query directly if structure changes

    let isResizing = false;
    let startY, startEditorFlexBasis, startOutputFlexBasis;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startY = e.clientY;
        // Get current computed flex-basis or height as fallback
        startEditorFlexBasis = editorPane.offsetHeight;
        startOutputFlexBasis = outputPane.offsetHeight;
        
        document.body.style.cursor = 'ns-resize'; // Indicate resizing globally
        document.body.style.userSelect = 'none'; // Prevent text selection

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    });

    function handleMouseMove(e) {
        if (!isResizing) return;

        const deltaY = e.clientY - startY;
        let newEditorHeight = startEditorFlexBasis + deltaY;
        let newOutputHeight = startOutputFlexBasis - deltaY;

        // Min height constraints (adjust values as needed)
        const minEditorHeight = 100; 
        const minOutputHeight = 150;

        // Ensure we don't exceed total available height logic implicitly handled by flexbox
        // but clamp to minimums
        if (newEditorHeight < minEditorHeight) {
            newEditorHeight = minEditorHeight;
            newOutputHeight = (startEditorFlexBasis + startOutputFlexBasis) - newEditorHeight;
        } else if (newOutputHeight < minOutputHeight) {
            newOutputHeight = minOutputHeight;
            newEditorHeight = (startEditorFlexBasis + startOutputFlexBasis) - newOutputHeight;
        }

        // Set flex-basis to control size, set flex-grow to 0 during resize
        editorPane.style.flexGrow = '0';
        editorPane.style.flexShrink = '0'; // Prevent shrinking too
        editorPane.style.flexBasis = `${newEditorHeight}px`;

        outputPane.style.flexGrow = '0';
        outputPane.style.flexShrink = '0';
        outputPane.style.flexBasis = `${newOutputHeight}px`;
    }

    function handleMouseUp() {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = ''; 
            document.body.style.userSelect = ''; 

            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            
            // Optional: Reset grow/shrink if needed, though basis should hold
            // editorPane.style.flexGrow = '1'; 
            // outputPane.style.flexGrow = '1';
        }
    }
} // end if (resizeHandle)
// === End Resizable Panes Logic ===

// === Floating Preview Button & Modal Logic ===
const showPreviewButton = document.getElementById('showPreviewButton');
const previewModal = document.getElementById('previewModal');
const previewModalClose = document.getElementById('previewModalClose');
const modalCardContentArea = document.getElementById('modalCardContentArea');
const modalCardStyleSelector = document.getElementById('modalCardStyleSelector');
const modalCardPreviewContent = document.getElementById('modalCardPreviewContent');

if (showPreviewButton && previewModal && previewModalClose && modalCardContentArea && modalCardStyleSelector && modalCardPreviewContent) {
    
    // Show Modal
    showPreviewButton.addEventListener('click', () => {
        const content = quill2.root.innerHTML; // Get content directly from AI editor
        modalCardContentArea.innerHTML = content; // Set modal preview content
        previewModal.style.display = 'flex'; // Show modal
        document.body.classList.add('modal-open'); // Add body class to prevent scrolling
    });
    
    // Close Modal
    previewModalClose.addEventListener('click', () => {
        previewModal.style.display = 'none';
        document.body.classList.remove('modal-open'); // Remove body class
    });
    
    // Modal Card Style Change
    modalCardStyleSelector.addEventListener('change', function() {
        updateModalCardStyle(this.value);
    });
    
    // Update Modal Card Style
    function updateModalCardStyle(style) {
        modalCardPreviewContent.className = 'card-preview ' + style;
    }
}
// === End Floating Preview Button & Modal Logic ===

// === Card Style Selector Logic ===
const cardStyleSelector = document.getElementById('cardStyleSelector');
const cardPreviewContent = document.getElementById('cardPreviewContent');

if (cardStyleSelector && cardPreviewContent) {
    cardStyleSelector.addEventListener('change', function() {
        updateCardStyle(this.value);
    });
    
    function updateCardStyle(style) {
        cardPreviewContent.className = 'card-preview ' + style;
    }
}
// === End Card Style Selector Logic ===

// === AI Config Modal Logic ===
const aiConfigButton = document.getElementById('aiConfigButton');
const aiConfigModal = document.getElementById('aiConfigModal');

if (aiConfigButton && aiConfigModal) {
    aiConfigButton.addEventListener('click', showAIConfigModal);
    
    function showAIConfigModal() {
        // Load stored settings values if they exist
        loadStoredAISettings();
        
        // Show the modal
        aiConfigModal.style.display = 'flex';
        document.body.classList.add('modal-open'); // Add body class to prevent scrolling
    }
    
    function closeAIConfigModal() {
        aiConfigModal.style.display = 'none';
        document.body.classList.remove('modal-open'); // Remove body class
    }
    
    // Switch tabs within provider settings
    function switchTab(tabId) {
        // Hide all tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Show selected tab panel
        document.getElementById(tabId).classList.add('active');
        
        // Update active tab
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    }
    
    // Switch views (system vs model settings)
    function switchView(viewId) {
        // Hide all views
        document.querySelectorAll('.modal-view').forEach(view => {
            view.classList.remove('active');
            view.style.display = 'none';
        });
        
        // Show selected view
        const selectedView = document.getElementById(viewId);
        if (selectedView) {
            selectedView.classList.add('active');
            selectedView.style.display = 'block';
        }
        
        // Update active tab
        document.querySelectorAll('.modal-view-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewId}"]`).classList.add('active');
    }
    
    // Load stored AI settings from localStorage
    function loadStoredAISettings() {
        // Get AI Provider
        const aiProvider = localStorage.getItem('ai_provider') || 'openai';
        document.getElementById('aiProvider').value = aiProvider;
        
        // Get System Prompts
        const systemPrompt = localStorage.getItem('ai_system_prompt') || '';
        const systemPrompt3 = localStorage.getItem('ai_system_prompt_3') || '';
        
        // Set values if elements exist
        if (document.getElementById('systemPrompt')) {
            document.getElementById('systemPrompt').value = systemPrompt;
        }
        
        if (document.getElementById('systemPrompt3')) {
            document.getElementById('systemPrompt3').value = systemPrompt3;
        }
        
        // OpenAI settings
        const aiModel = localStorage.getItem('ai_model') || 'gpt-3.5-turbo';
        const temperature = localStorage.getItem('ai_temperature') || '0.7';
        const apiKey = localStorage.getItem('openai_api_key') || '';
        
        // Set OpenAI values if elements exist
        if (document.getElementById('aiModel')) {
            document.getElementById('aiModel').value = aiModel;
        }
        
        if (document.getElementById('temperature')) {
            document.getElementById('temperature').value = temperature;
        }
        
        if (document.getElementById('tempValue')) {
            document.getElementById('tempValue').textContent = temperature;
        }
        
        if (document.getElementById('apiKey')) {
            document.getElementById('apiKey').value = apiKey;
        }
        
        // Claude settings
        const claudeModel = localStorage.getItem('claude_model') || 'claude-3-sonnet-20240229';
        const claudeTemperature = localStorage.getItem('claude_temperature') || '0.7';
        const claudeApiKey = localStorage.getItem('claude_api_key') || '';
        
        // Set Claude values if elements exist
        if (document.getElementById('claudeModel')) {
            document.getElementById('claudeModel').value = claudeModel;
        }
        
        if (document.getElementById('claudeTemperature')) {
            document.getElementById('claudeTemperature').value = claudeTemperature;
        }
        
        if (document.getElementById('claudeTempValue')) {
            document.getElementById('claudeTempValue').textContent = claudeTemperature;
        }
        
        if (document.getElementById('claudeApiKey')) {
            document.getElementById('claudeApiKey').value = claudeApiKey;
        }
    }
}

// === Screenshot/Download functionality ===
// Function to capture and download a screenshot
async function captureAndDownloadScreenshot(elementId, filename = 'preview.png') {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID ${elementId} not found`);
        return;
    }
    
    try {
        // Use html2canvas to capture the element
        const canvas = await html2canvas(element, {
            scale: 2, // Higher quality
            useCORS: true, // Allow cross-origin images
            logging: false, // Disable logging
            backgroundColor: null // Transparent background
        });
        
        // Convert to blob with good quality
        canvas.toBlob(function(blob) {
            // Create download link
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename;
            
            // Trigger download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            // Clean up
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
            
            // Show success message
            showSuccessToast('Preview downloaded!');
        }, 'image/png', 0.95); // High quality PNG
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        showGlobalError('Failed to generate preview image: ' + error.message);
    }
}

// Event listeners for screenshot buttons
document.addEventListener('DOMContentLoaded', function() {
    // Modal screenshot button
    const screenshotButton = document.getElementById('screenshotButton');
    if (screenshotButton) {
        screenshotButton.addEventListener('click', function() {
            captureAndDownloadScreenshot('modalCardPreviewContent', 'ai-preview.png');
        });
    }
    
    // Tab 1 screenshot button
    const screenshotButtonTab1 = document.getElementById('screenshotButtonTab1');
    if (screenshotButtonTab1) {
        screenshotButtonTab1.addEventListener('click', function() {
            captureAndDownloadScreenshot('cardPreviewContent', 'card-preview.png');
        });
    }
    
    // File input change handlers
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (this.files.length === 0) return;
            
            const file = this.files[0];
            const statusEl = document.getElementById('importStatus');
            if (statusEl) {
                statusEl.textContent = `Reading file: ${file.name}`;
                statusEl.className = 'import-status';
                statusEl.style.display = 'block';
            }
            
            if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                processExcelFile(file);
            } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                processWordFile(file);
            } else {
                if (statusEl) {
                    statusEl.textContent = 'Unsupported file format';
                    statusEl.className = 'import-status import-error';
                }
            }
        });
    }
    
    // File input change handler for tab 2
    const fileInput2 = document.getElementById('fileInput2');
    if (fileInput2) {
        fileInput2.addEventListener('change', function(e) {
            if (this.files.length === 0) return;
            
            const file = this.files[0];
            const statusEl = document.getElementById('importStatus2');
            if (statusEl) {
                statusEl.textContent = `Reading file: ${file.name}`;
                statusEl.className = 'import-status';
                statusEl.style.display = 'block';
            }
            
            if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                processExcelFile2(file);
            } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                processWordFile2(file);
            } else {
                if (statusEl) {
                    statusEl.textContent = 'Unsupported file format';
                    statusEl.className = 'import-status import-error';
                }
            }
        });
    }
    
    // File input change handler for tab 3
    const fileInput3 = document.getElementById('fileInput3');
    if (fileInput3) {
        fileInput3.addEventListener('change', function(e) {
            if (this.files.length === 0) return;
            
            const file = this.files[0];
            const statusEl = document.getElementById('importStatus3');
            if (statusEl) {
                statusEl.textContent = `Reading file: ${file.name}`;
                statusEl.className = 'import-status';
                statusEl.style.display = 'block';
            }
            
            if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                processExcelFile3(file);
            } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                processWordFile3(file);
            } else {
                if (statusEl) {
                    statusEl.textContent = 'Unsupported file format';
                    statusEl.className = 'import-status import-error';
                }
            }
        });
    }

    // AI Format Button Click Handler - Modified to just show notification for now
    const aiFormatButton = document.getElementById('aiFormatButton');
    if (aiFormatButton) {
        aiFormatButton.addEventListener('click', function() {
            aiFormatButton.classList.add('loading');
            aiFormatButton.innerHTML = '<div class="ai-loader"></div> Processing...';
            
            // Simulate API call with setTimeout
            setTimeout(() => {
                showSuccessToast("This would call the AI API in a full implementation", 'ai');
                aiFormatButton.classList.remove('loading');
                aiFormatButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <path d="M9 21V9"></path>
                    <path d="M15 9v3"></path>
                    <path d="M15 15v6"></path>
                    <circle cx="15" cy="12" r="0.5"></circle>
                    <circle cx="15" cy="18" r="0.5"></circle>
                </svg> Format with AI`;
            }, 1500);
        });
    }
    
    // AI Process Button (for Tab 3)
    const aiFormatButton3 = document.getElementById('aiFormatButton3');
    if (aiFormatButton3) {
        aiFormatButton3.addEventListener('click', function() {
            aiFormatButton3.classList.add('loading');
            aiFormatButton3.innerHTML = '<div class="ai-loader"></div> Processing...';
            
            // Simulate API call with setTimeout
            setTimeout(() => {
                showSuccessToast("This would call the second AI processing step in a full implementation", 'ai');
                aiFormatButton3.classList.remove('loading');
                aiFormatButton3.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <path d="M9 21V9"></path>
                    <path d="M15 9v3"></path>
                    <path d="M15 15v6"></path>
                    <circle cx="15" cy="12" r="0.5"></circle>
                    <circle cx="15" cy="18" r="0.5"></circle>
                </svg> Process with AI`;
            }, 1500);
        });
    }
    
    // Save AI Config Settings
    const aiModalSave = document.getElementById('aiModalSave');
    if (aiModalSave) {
        aiModalSave.addEventListener('click', function() {
            // Get Provider
            const aiProvider = document.getElementById('aiProvider').value;
            localStorage.setItem('ai_provider', aiProvider);
            
            // Get and Save Shared System Prompt (Tab 2)
            const systemPrompt = document.getElementById('systemPrompt').value;
            localStorage.setItem('ai_system_prompt', systemPrompt);
            
            // Get and Save Tab 3 System Prompt
            const systemPrompt3 = document.getElementById('systemPrompt3').value;
            localStorage.setItem('ai_system_prompt_3', systemPrompt3);
            
            // Save OpenAI settings 
            const aiModel = document.getElementById('aiModel').value;
            const temperature = document.getElementById('temperature').value;
            const apiKey = document.getElementById('apiKey').value;
            
            localStorage.setItem('ai_model', aiModel);
            localStorage.setItem('ai_temperature', temperature);
            
            if (apiKey) {
                localStorage.setItem('openai_api_key', apiKey);
            }
            
            // Save Claude settings
            const claudeModel = document.getElementById('claudeModel').value;
            const claudeTemperature = document.getElementById('claudeTemperature').value;
            const claudeApiKey = document.getElementById('claudeApiKey').value;
            
            localStorage.setItem('claude_model', claudeModel);
            localStorage.setItem('claude_temperature', claudeTemperature);
            
            if (claudeApiKey) {
                localStorage.setItem('claude_api_key', claudeApiKey);
            }
            
            // Close the modal
            closeAIConfigModal();
            
            // Show success message
            showSuccessToast("AI settings saved successfully!", 'settings');
        });
    }
});

// Initialize tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching for AI Config modal (Provider Tabs)
    document.querySelectorAll('#model-settings-view .modal-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // View switching for AI Config modal (System vs Model Settings)
    document.querySelectorAll('.modal-view-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const viewId = this.getAttribute('data-view');
            switchView(viewId);
        });
    });

    // Temperature sliders
    const tempSlider = document.getElementById('temperature');
    const tempValue = document.getElementById('tempValue');
    if (tempSlider && tempValue) {
        tempSlider.addEventListener('input', function() {
            tempValue.textContent = this.value;
        });
    }
    
    const claudeTempSlider = document.getElementById('claudeTemperature');
    const claudeTempValue = document.getElementById('claudeTempValue');
    if (claudeTempSlider && claudeTempValue) {
        claudeTempSlider.addEventListener('input', function() {
            claudeTempValue.textContent = this.value;
        });
    }
    
    // Add event listeners for close and cancel buttons
    const aiModalClose = document.getElementById('aiModalClose');
    const aiModalCancel = document.getElementById('aiModalCancel');
    
    if (aiModalClose) {
        aiModalClose.addEventListener('click', closeAIConfigModal);
    }
    
    if (aiModalCancel) {
        aiModalCancel.addEventListener('click', closeAIConfigModal);
    }
}); 