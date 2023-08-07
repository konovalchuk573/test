(function(){

	const block_first = document.querySelector('.contact__block-first');
	const block_second = document.querySelector('.contact__block-second');
	const button_next = document.querySelector('.contact__button--next');
	const button_back = document.querySelector('.contact__button--back');
	const button_submit = document.querySelector('.contact__submit');
	const info_block = document.querySelector('.contact__info-block');
	const contact_form = document.querySelector('.contact__form');
	const input_phone = document.querySelector('#phone');
	const input_city = document.querySelector('#city');
	const input_name = document.querySelector('#username');
	const input_country = document.querySelector('#country');
	const input_file = document.querySelector('#file_upload');
	const file_block = document.querySelector('.contact__file-block');
	const upload_label = document.querySelector('.contact__upload-label');
	const file_name = document.querySelector('.contact__file-name');
	const file_size = document.querySelector('.contact__file-size');
	const file_date = document.querySelector('.contact__file-date');
	const file_remove = document.querySelector('.contact__file-remove');
	const required_fields = [input_phone, input_city, input_name, input_country];
	const phone_pattern = /^[+][0-9]+$/;
	const allowed_extensions = ['doc', 'docx', 'rtf', 'txt'];
	const filesize_max = 10485760;
	const url = 'https://my-json-server.typicode.com/Nezdara/form-fake-server/data';
	let data = {};
	let error_fields = 0;

	required_fields.forEach((element) => {
		element.addEventListener('focus', function(e) {
			let element_class = e.target.classList;
			let error_block = e.target.closest('.contact__field').querySelector('.contact__field-error');
			if (element_class.contains('error')) {
				element_class.remove('error');
			}
			if (error_block) {
				error_block.remove();
			}
		});
	});

	function inputValidation(input, text) {
		input.classList.add('error');
		if (!input.closest('.contact__field').querySelector('.contact__field-error')) {
			input.closest('.contact__field').insertAdjacentHTML('beforeend', '<div class="contact__field-error">' + text + '</div>');
		}
		error_fields = 1;
	}

	button_next.addEventListener('click', function() {
		error_fields = 0;

		required_fields.forEach((element) => {
			if (!element.value) {
				inputValidation(element, 'This field is required');
			}
		});

		if (!phone_pattern.test(input_phone.value)) {
			inputValidation(input_phone, 'First + and numbers allowed');
		}

		if (!error_fields) {
			block_first.style.display = 'none';
			block_second.style.display = 'block';
			button_next.style.display = 'none';
			button_back.style.display = 'block';
			button_submit.style.display = 'block';
			button_submit.style.display = 'block';
			info_block.textContent = 'Block 2';
		}
	});

	button_back.addEventListener('click', function() {
		block_first.style.display = 'block';
		block_second.style.display = 'none';
		button_next.style.display = 'block';
		button_back.style.display = 'none';
		button_submit.style.display = 'none';
		info_block.textContent = 'Block 1';
	});

	input_file.onchange = function() {
		let error_text = this.closest('.contact__field').querySelector('.contact__field-error');
		let file_extension = this.value.split('.').pop().toLowerCase();

		if (error_text) {
			error_text.remove();
		}

		if (!allowed_extensions.includes(file_extension)) {
			inputValidation(input_file, 'Unknown file format. Please use .doc, .docx, .rtf, .txt files');
			resetFileData();
		} else if (this.files[0].size >= filesize_max) {
			inputValidation(input_file, 'Maximum allowed filesize is 10 Mb');
			resetFileData();
		} else {
			error_fields = 0;
			file_block.style.display = 'block';
			upload_label.style.display = 'none';
			file_name.textContent = this.files[0].name;
			file_size.textContent = (this.files[0].size / 1024).toFixed(2);
			file_date.textContent = new Date().toLocaleDateString();
		}
	};

	function resetFileData() {
		file_block.style.display = 'none';
		upload_label.style.display = 'block';
		error_fields = 0;
		input_file.value = '';
	}

	file_remove.addEventListener('click', function() {
		file_block.style.display = 'none';
		upload_label.style.display = 'block';
		file_name.textContent = '';
		file_size.textContent = '';
		file_date.textContent = '';
		input_file.value = '';
	});

	contact_form.addEventListener('submit', function(e) {
		e.preventDefault();
		if (!error_fields) {
			formData();
			sendParams();
		}
	});
	
	function formData() {
		data = {
			'contactInfo': {
				'phone': input_phone.value,
				'city': input_city.value,
				'country': input_country.value,
				'name': input_name.value
			},
			'questions': [
				{
					'question': 'Morbi placerat laoreet turpis ut pharetra?',
					'answer': document.querySelector('#answer_first').value
				},
				{
					'question': 'Donec efficitur fermentum augue vestibulum gravida?',
					'answer': document.querySelector('#answer_second').value
				},
				{
					'question': 'Praesent ullamcorper malesuada nunc ac blandit?',
					'answer': document.querySelector('#answer_third').value
				},
				{
					'question': 'Proin euismod leo eu metus commodo sodales?',
					'answer': document.querySelector('#answer_fourth').value
				},
				{
					'question': 'Nunc consequat blandit quam dapibus lacinia?',
					'answer': document.querySelector('#other').value
				},
			],
			'file': {
				'name': input_file.files[0] ? input_file.files[0].name : '',
				'format': input_file.value.split('.').pop().toUpperCase(),
				'size': input_file.files[0] ? input_file.files[0].size : ''
			}
		};
	}

	function sendParams() {
		fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		.then((response) => {
			return response.text();
		})
		.then((data) => {
			alert(data);
		})
		.catch((error) => {
			alert(error);
		});
	}

})();