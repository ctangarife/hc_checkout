<?php
printVar('Hola');
printVar($variables['form']);
$form=drupal_get_form('commerce-checkout-form-checkout');
print render($form);
?>
