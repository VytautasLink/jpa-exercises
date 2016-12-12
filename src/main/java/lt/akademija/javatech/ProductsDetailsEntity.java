package lt.akademija.javatech;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@Entity
public class ProductsDetailsEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String detailsData;

	@OneToOne(mappedBy = "products")
	public String getDetailsData() {
		return detailsData;
	}

	public void setDetailsData(String detailsData) {
		this.detailsData = detailsData;
	}
}
