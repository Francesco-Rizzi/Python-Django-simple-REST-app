//CONFIG & DATA
const path         = window.location.pathname;
const ENDPOINT     = path + (path[path.length ] == '/' ? '' : '/') + 'api/ContactUser/';
const $mainWrapper = $('body');
let items          = [];
let unFiltered     = false;

//INITIAL VIEW
$.get(ENDPOINT).then(data =>{
	
	items = data;
	sortItems();
	renderView();
	
});

//DELETE COMMAND
$mainWrapper.delegate('.js-delete-contact', 'click', e =>{
	
	const itemID = $(e.target).parents('.js-contact-item').data('id');
	deleteContact(itemID);
	
});

//UPDATE COMMAND
$mainWrapper.delegate('.js-edit-contact-form', 'click', e =>{
	initForm('PATCH', e);
});

//NEW COMMAND
$mainWrapper.delegate('.js-new-contact-form', 'click', e =>{
	initForm('POST', e);
});

//HANDLE FORM
$mainWrapper.delegate('.js-submit-form', 'submit', e =>{
	handleForm(e);
});

$mainWrapper.delegate('.js-close-form', 'click', e =>{
	closeForm();
});

//FILTERING
$mainWrapper.delegate('.js-filter-input', 'keyup', e =>{
	handleFilter(e);
});

//UTILITIES
function initForm( method, e ){
	
	const $form  = $('.js-main-form');
	const $modal = $form.parents('.js-modal-form');
	
	$form.data('method', method);
	$modal.addClass('is-visible');
	$mainWrapper.addClass('mod-modal');
	
	if ( method !== 'POST' ) {//EDITING
		
		const $item    = $(e.target).parents('.js-contact-item');
		const itemData = $item[ 0 ].dataset;
		$form.data('item-id', itemData.id);
		
		$.each(itemData, function( k, val ){
			//PRE-FILL FORM
			$form.find(`[name=${k}]`).val(val);
		});
		
	}
	
}

function closeForm(){
	
	const $form  = $('.js-main-form');
	const $modal = $form.parents('.js-modal-form');
	
	$modal.removeClass('is-visible');
	$mainWrapper.removeClass('mod-modal');
	$form[ 0 ].reset();
	
}

function handleForm( e ){
	
	e.preventDefault();
	
	const $form  = $(e.target);
	const method = $form.data('method');
	
	let itemID;
	let targetEndpoint = ENDPOINT;
	
	if ( method !== 'POST' ) {//EDITING
		
		itemID         = $form.data('item-id');
		targetEndpoint = ENDPOINT + itemID + '/';
		
	}
	
	$.ajax({
			   url     : targetEndpoint,
			   type    : method,
			   data    : $form.serialize(),
			   success : function( result ){
			
				   if ( method !== 'POST' ) {
				
					   let index      = _.findIndex(items, item => item.id == itemID);
					   items[ index ] = result;
				
				   } else {
				
					   items.push(result);
				
				   }
			
				   sortItems();
				   renderView();
				   closeForm();
			
			   },
			   error   : function( request ){
				   alert(request.responseText);
			   }
		   });
	
}

function deleteContact( id ){
	
	$.ajax({
			   url     : ENDPOINT + id + '/',
			   type    : 'DELETE',
			   success : function(){
			
				   items = _.filter(items, function( item ){
					   return item.id !== id;
				   });
			
				   renderView();
			
			   },
			   error   : function( request ){
				   alert(request.responseText);
			   }
		   });
	
}

function renderView(){
	
	$('.js-contact-items').empty();
	
	$.each(items, ( k, item ) =>{
		
		$('.js-contact-items').append(createContactUser(item));
		
	});
	
}

function sortItems(){
	items.sort(( a, b ) => itemToSTR(a).localeCompare(itemToSTR(b)));
}

function itemToSTR( item ){
	return `${item.name} ${item.surname}`.toLowerCase();
}

function handleFilter( e ){
	
	let currentKey = e.target.value;
	
	if ( currentKey ) {
		filter(currentKey);
	} else {
		clearFilter();
	}
	
	renderView();
	
}

function filter( key ){
	
	unFiltered = unFiltered || items;
	items      = _.filter(items, function( item ){
		return itemToSTR(item).includes(key);
	});
	
}

function clearFilter(){
	
	items = unFiltered || items;
	
}

function createContactUser( item ){
	
	return `<div class="contact-item js-contact-item" data-id="${item.id}" data-name="${item.name}" data-surname="${item.surname}" data-mobile="${item.mobile}" data-email="${item.email}" data-info="${item.info}">
		<div class="contact-item-image-wrapper">
			<img src="static/contacts/images/avatar.jpg" alt="User avatar">
		</div>
		<div class="contact-item-text">
			<h3 class="contact-item-name">${item.name} ${item.surname}</h3>
			<p class="contact-item-number"><a href="tel:${item.mobile}">${item.mobile}</a></p>
			<div class="contact-item-buttons">
				<button class="js-delete-contact link-mod-delete">delete</button>
				<button class="js-edit-contact-form">edit</button>
			</div>
		</div>
	</div>`;
	
}