<?php
session_start();
$project_dir = $_SERVER['DOCUMENT_ROOT'] . "/projects";
if (!is_dir($project_dir)) mkdir($project_dir);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $project = $_POST['project'] ?? '';
    $new_project = $_POST['new_project'] ?? '';
    $imgData = $_POST['img'] ?? null;

    // 建立新專案
    if ($action === 'create' && $new_project && preg_match('/^[\w\-]+$/', $new_project)) {
        $path = "$project_dir/$new_project.json";
        $data = ['layers' => []];
        file_put_contents($path, json_encode($data));
        header("Location: /api/index.php");
        exit;
    }
    // 儲存專案 (layers為json)
    if ($action === 'save' && $project && preg_match('/^[\w\-]+$/', $project) && $imgData) {
        $path = "$project_dir/$project.json";
        file_put_contents($path, $imgData);
        header("Location: /api/index.php");
        exit;
    }
    // 載入專案
    if ($action === 'load' && $project && file_exists("$project_dir/$project.json")) {
        $data = json_decode(file_get_contents("$project_dir/$project.json"), true);
        $_SESSION['loaded_img'] = $data;
        header("Location: /api/index.php");
        exit;
    }
    // 刪除專案
    if ($action === 'delete' && $project && file_exists("$project_dir/$project.json")) {
        unlink("$project_dir/$project.json");
        header("Location: /api/index.php");
        exit;
    }
}
$projects = array_diff(scandir($project_dir), array('.', '..'));
?>
<ul>
<?php foreach ($projects as $proj): ?>
    <li>
        <form action="/api/project_manager.php" method="post" style="display:inline;">
            <input type="hidden" name="action" value="load">
            <input type="hidden" name="project" value="<?= htmlspecialchars($proj) ?>">
            <button type="submit"><?= htmlspecialchars($proj, ENT_QUOTES) ?></button>
        </form>
        <form action="/api/project_manager.php" method="post" style="display:inline;" onsubmit="return confirm('確定刪除?');">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="project" value="<?= htmlspecialchars($proj) ?>">
            <button type="submit">刪除</button>
        </form>
    </li>
<?php endforeach; ?>
</ul>
<form action="/api/project_manager.php" method="post" style="margin-bottom:8px;">
    <input type="hidden" name="action" value="create">
    <input type="text" name="new_project" placeholder="新專案名稱">
    <button type="submit">建立</button>
</form>
