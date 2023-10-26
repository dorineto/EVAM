const scriptCompleto = `
create table if not exists Medida (
    medida_id tinyint not null primary key,
    descricao varchar(50) not null
);

insert or ignore into Medida (
    medida_id, 
    descricao
) 
values 
 (1, 'Unidade')
,(2, 'Metro')
,(3, 'Centimetro')
,(4, 'Litro')
,(5, 'Mililitro')
,(6, 'Kilo')
,(7, 'Grama')
,(8, 'Miligrama');

create table if not exists Item_tipo (
    item_tipo_id tinyint not null primary key,
    descricao varchar(50) not null
);

insert or ignore into Item_tipo (
    item_tipo_id, 
    descricao
) 
values 
 (1, 'Materia-prima')
,(2, 'Produto');

create table if not exists Item (
    item_id int NOT NULL primary key,
    medida_id tinyint not null,
    item_tipo_id tinyint not null,
    descricao varchar(50) not null,
    qtd_estoque numeric(10,2) not null,
    med_valor_unid numeric(10,2) not null,
    inclusao timestamp not null DEFAULT CURRENT_TIMESTAMP,
    foreign key(medida_id) REFERENCES Medida(medida_id),
    foreign key(item_tipo_id) REFERENCES Item_tipo(item_tipo_id)
);

create table if not exists Cliente (
    cliente_id int NOT NULL primary key,
    descricao varchar(255) not null,
    inclusao timestamp not null DEFAULT CURRENT_TIMESTAMP
);

create table if not exists Local (
    local_id int NOT NULL primary key,
    descricao varchar(255) not null,
    inclusao timestamp not null DEFAULT CURRENT_TIMESTAMP
);

create table if not exists Ordem_venda (
    ordem_venda_id int NOT NULL primary key,
    cliente_id int not null,
    local_id not null,
    valor_total numeric(10,2) not null,
    inclusao timestamp not null DEFAULT CURRENT_TIMESTAMP,
    foreign key(cliente_id) REFERENCES Cliente(cliente_id),
    foreign key(local_id) REFERENCES Local(local_id)
);

create table if not exists Item_venda (
    ordem_venda_id int not null,
    item_id int NOT NULL,
    medida_id tinyint not null,
    valor_total numeric(10,2) not null,
    qtd_vendido numeric(10,2) not null,
    PRIMARY KEY(ordem_venda_id, item_id),
    foreign key(ordem_venda_id) REFERENCES Ordem_venda(ordem_venda_id),
    foreign key(item_id) REFERENCES Item(item_id),
    foreign key(medida_id) REFERENCES Medida(medida_id)
);

create table if not exists Ordem_compra (
    ordem_compra_id int NOT NULL primary key,
    valor_total numeric(10,2) not null,
    inclusao timestamp not null DEFAULT CURRENT_TIMESTAMP
);

create table if not exists Item_compra (
    ordem_compra_id int not null,
    item_id int NOT NULL,
    medida_id tinyint not null,
    valor_total numeric(10,2) not null,
    qtd_comprado numeric(10,2) not null,
    PRIMARY KEY(ordem_compra_id, item_id),
    foreign key(ordem_compra_id) REFERENCES Ordem_compra(ordem_compra_id),
    foreign key(item_id) REFERENCES Item(item_id),
    foreign key(medida_id) REFERENCES Medida(medida_id)
);

create table if not exists Receita (
    receita_id int not null PRIMARY KEY,
    versao_atual int NOT NULL,
    inclusao timestamp not null DEFAULT CURRENT_TIMESTAMP
);

create table if not exists Receita_versao (
    receita_id int not null,
    versao int NOT NULL,
    valor_total_material numeric(10,2) NOT NULL,
    inclusao timestamp not null DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(receita_id, versao),
    foreign key(receita_id) REFERENCES Receita(receita_id)
);

create table if not exists Receita_realizada (
    receita_realizada_id int not null PRIMARY KEY,
    receita_id int not null,
    versao int NOT NULL,
    qtd_receita_realizada numeric(10,2) not null,
    inclusao timestamp not null DEFAULT CURRENT_TIMESTAMP,
    foreign key(receita_id, versao) REFERENCES Receita_versao(receita_id, versao)
);

create table if not exists Receita_componente_tipo (
    receita_componente_tipo_id tinyint not null PRIMARY KEY,
    descricao varchar(50) not null
);

insert or ignore into Receita_componente_tipo (
    receita_componente_tipo_id, 
    descricao
) 
values 
 (1, 'Ingrediente')
,(2, 'Produto');

create table if not exists Receita_componente (
    receita_componentes_id int not null PRIMARY KEY,
    receita_id int not null,
    versao int NOT NULL,
    item_id int not null,
    receita_componente_tipo_id tinyint not null,
    medida_id tinyint  not null,
    qtd numeric(10,2) not null,
    foreign key(receita_id, versao) REFERENCES Receita_versao(receita_id, versao),
    foreign key(item_id) REFERENCES Item(item_id),
    foreign key(receita_componente_tipo_id) REFERENCES Receita_componente_tipo(receita_componente_tipo_id),
    foreign key(medida_id) REFERENCES Medida(medida_id)
);

create table if not exists Configuracao (
    configuracao_id int not null PRIMARY KEY,
    chave varchar(255) not null,
    valor varchar(1024) not null
);`;

export const scriptCriacaoDB = scriptCompleto
    .split(';')
    .filter(es => es)
    .map(es => es.trim() + ';');
