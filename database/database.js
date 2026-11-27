import * as SQLite from 'expo-sqlite';

let dbPromise = null;

export async function getDatabase() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('veiculos_app_v3.db');
      await db.execAsync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS usuario (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          senha TEXT NOT NULL,
          logado INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS favoritos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          veiculo_id TEXT NOT NULL,
          marca TEXT NOT NULL,
          modelo TEXT NOT NULL,
          categoria TEXT NOT NULL,
          descricao TEXT NOT NULL,
          observacao TEXT DEFAULT '',
          FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
          UNIQUE(usuario_id, veiculo_id)
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}

export async function cadastrarUsuario(username, senha) {
  const db = await getDatabase();
  const usernameFormatado = username.trim().toLowerCase();

  const existente = await db.getFirstAsync(
    'SELECT id FROM usuario WHERE username = ?',
    [usernameFormatado]
  );

  if (existente) {
    throw new Error('Este nome de usuário já está em uso.');
  }

  await db.runAsync('UPDATE usuario SET logado = 0');

  const result = await db.runAsync(
    'INSERT INTO usuario (username, senha, logado) VALUES (?, ?, 1)',
    [usernameFormatado, senha]
  );

  return {
    id: result.lastInsertRowId,
    username: usernameFormatado,
  };
}

export async function autenticarUsuario(username, senha) {
  const db = await getDatabase();
  const usernameFormatado = username.trim().toLowerCase();

  const user = await db.getFirstAsync(
    'SELECT id, username FROM usuario WHERE username = ? AND senha = ?',
    [usernameFormatado, senha]
  );

  if (!user) {
    throw new Error('Nome de usuário ou senha inválidos.');
  }

  await db.runAsync('UPDATE usuario SET logado = 0');
  await db.runAsync('UPDATE usuario SET logado = 1 WHERE id = ?', [user.id]);

  return user;
}

export async function getUsuarioLogado() {
  const db = await getDatabase();
  const user = await db.getFirstAsync(
    'SELECT id, username FROM usuario WHERE logado = 1 LIMIT 1'
  );
  return user || null;
}

export async function logoutUsuario() {
  const db = await getDatabase();
  await db.runAsync('UPDATE usuario SET logado = 0');
}

export async function adicionarFavorito(usuarioId, veiculo, observacao = '') {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR IGNORE INTO favoritos
      (usuario_id, veiculo_id, marca, modelo, categoria, descricao, observacao)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      usuarioId,
      veiculo.id,
      veiculo.marca,
      veiculo.modelo,
      veiculo.categoria,
      veiculo.desc,
      observacao,
    ]
  );
}

export async function listarFavoritosUsuario(usuarioId) {
  const db = await getDatabase();
  return await db.getAllAsync(
    'SELECT * FROM favoritos WHERE usuario_id = ? ORDER BY id DESC',
    [usuarioId]
  );
}

export async function atualizarObservacaoFavorito(favoritoId, novaObservacao) {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE favoritos SET observacao = ? WHERE id = ?',
    [novaObservacao.trim(), favoritoId]
  );
}

export async function removerFavorito(favoritoId) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM favoritos WHERE id = ?', [favoritoId]);
}

export async function removerFavoritoPorVeiculo(usuarioId, veiculoId) {
  const db = await getDatabase();
  await db.runAsync(
    'DELETE FROM favoritos WHERE usuario_id = ? AND veiculo_id = ?',
    [usuarioId, veiculoId]
  );
}