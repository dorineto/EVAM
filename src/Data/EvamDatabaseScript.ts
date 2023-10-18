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
    item_id int int NOT NULL,
  	medida_id tinyint not null,
  	valor_total numeric(10,2) not null,
  	qtd_vendido numeric(10,2) not null,
  	PRIMARY KEY(ordem_venda_id, item_id),
  	foreign key(ordem_venda_id) REFERENCES Ordem_venda(ordem_venda_id),
  	foreign key(item_id) REFERENCES Item(item_id),
  	foreign key(medida_id) REFERENCES Medida(medida_id)
);
`;

export const scriptCriacaoDB = scriptCompleto.split(';').map(es => es + ';');
