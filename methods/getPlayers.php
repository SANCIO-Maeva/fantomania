<?php
$host = 'localhost';
$dbname = 'fantomania';
$username = 'root';
$password = 'root';

try{
    $pdo = new PDO(
    'mysql:host=' . $host . ';dbname=' . $dbname,
    $username,
    $password,
    array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING, PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8')
    );
    // echo "Connect to $dbname on $host with sucess";
} catch (PDOException $e){
    die("can't connect to $dbname: "  .$e->getMessage());
}

if (isset($_GET["id"])){
    $playerId = $_GET["id"];
    $request = $pdo->prepare('SELECT * FROM players');
    // $request->bindParam('ghostyId', $ghostId, PDO::PARAM_STR);
    
    $player = $request->execute();
    $player = $request->fetchAll(PDO::FETCH_ASSOC);

}

echo json_encode($player);

?>