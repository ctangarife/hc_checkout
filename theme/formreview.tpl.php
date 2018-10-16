<div class="title row">
	<div class="col-md-6 col-md-offset-3">
		<h1 class="text-center text-title-recurrence"><?php print($variables['messagePonds']);?></h1>
	</div>	
</div>
<?php
//printVar('Hola');
print drupal_render(drupal_get_form('uc_cart_checkout_review_form'));
?>